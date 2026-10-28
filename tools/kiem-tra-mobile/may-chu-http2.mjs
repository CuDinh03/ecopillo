#!/usr/bin/env node
/**
 * Máy chủ tĩnh HTTP/2 + nén gzip để đo tốc độ gần giống Cloudflare Pages
 * (vite preview chỉ có HTTP/1.1: không ưu tiên ảnh fetchpriority="high", số đo LCP sai lệch).
 *
 *   openssl req -x509 -newkey rsa:2048 -nodes -days 7 -subj /CN=localhost \
 *     -keyout /tmp/eco-h2.key -out /tmp/eco-h2.crt
 *   node tools/kiem-tra-mobile/may-chu-http2.mjs <thư-mục> <cổng> [--spa]
 *
 * --spa: link không có file thì trả index.html gốc (như bản trước khi dựng sẵn HTML).
 * Không có --spa: thư mục có index.html thì trả nó, không có thì 404.html (như Cloudflare Pages).
 * Playwright mở với ignoreHTTPSErrors: true.
 */
import { createSecureServer, constants } from 'node:http2'
import { readFileSync, statSync, existsSync } from 'node:fs'
import { join, extname, normalize } from 'node:path'
import { gzipSync } from 'node:zlib'

const [dir, portArg, flag] = process.argv.slice(2)
if (!dir || !portArg) {
  console.error('Cách dùng: may-chu-http2.mjs <thư-mục> <cổng> [--spa]')
  process.exit(1)
}
const ROOT = normalize(dir)
const SPA = flag === '--spa'
const KEY = process.env.H2_KEY || '/tmp/eco-h2.key'
const CERT = process.env.H2_CERT || '/tmp/eco-h2.crt'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}
const COMPRESS = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt'])
const cache = new Map()

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidate = join(ROOT, clean)
  if (!candidate.startsWith(ROOT)) return null
  if (existsSync(candidate) && statSync(candidate).isFile()) return { file: candidate, status: 200 }
  const asDir = join(candidate, 'index.html')
  if (!SPA && existsSync(asDir)) return { file: asDir, status: 200 }
  if (SPA) return { file: join(ROOT, 'index.html'), status: 200 }
  return { file: join(ROOT, '404.html'), status: 404 }
}

function load(file, gzip) {
  const key = `${file}|${gzip}`
  if (!cache.has(key)) {
    const raw = readFileSync(file)
    cache.set(key, gzip ? gzipSync(raw, { level: 6 }) : raw)
  }
  return cache.get(key)
}

const server = createSecureServer({ key: readFileSync(KEY), cert: readFileSync(CERT), allowHTTP1: true }, (req, res) => {
  const hit = resolveFile(req.url)
  if (!hit || !existsSync(hit.file)) {
    res.writeHead(404)
    res.end()
    return
  }
  const ext = extname(hit.file)
  const gzip = COMPRESS.has(ext) && /gzip/.test(req.headers['accept-encoding'] || '')
  const body = load(hit.file, gzip)
  const headers = {
    [constants.HTTP2_HEADER_CONTENT_TYPE]: TYPES[ext] || 'application/octet-stream',
    'cache-control': 'no-cache',
  }
  if (gzip) headers['content-encoding'] = 'gzip'
  res.writeHead(hit.status, headers)
  res.end(body)
})

server.listen(Number(portArg), '127.0.0.1', () => {
  console.log(`HTTP/2 ${SPA ? 'SPA' : 'tĩnh'} https://127.0.0.1:${portArg}/ ← ${ROOT}`)
})
