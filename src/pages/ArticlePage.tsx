import { Link, useLocation, useParams } from 'react-router-dom'
import { PostCard } from '../components/blog/PostCard'
import { WordPressBody } from '../components/blog/WordPressBody'
import { JsonLd } from '../components/seo/JsonLd'
import { Icon } from '../components/ui/Icon'
import { Breadcrumb } from '../components/ui/PageHero'
import { Placeholder } from '../components/ui/Placeholder'
import { ContactButtons, Container } from '../components/ui/primitives'
import { PATHS } from '../data/links'
import { ALL_POSTS, anyPostBySlug, formatPostDate } from '../data/allPosts'
import type { PostBlock } from '../data/posts'
import { relatedForPost } from '../data/related'
import { ExploreMore } from '../components/ui/ExploreMore'
import { usePageMeta } from '../hooks/usePageMeta'
import { articleLd, shareImageOf } from '../lib/structuredData'
import { NotFoundPage } from './NotFoundPage'
import { COMMON_TEXT } from '../data/pageText/common'
import { BLOG_TEXT } from '../data/pageText/blog'
import { chen } from '../data/pageText/define'

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-left font-display mt-10 text-[1.4rem] leading-tight text-deep-900 sm:text-[1.6rem]">{block.text}</h2>
    case 'list':
      return (
        <ul className="mt-5 space-y-3 text-left">
          {block.items.map((item, i) => (
            <li key={`${i}-${item}`} className="flex gap-3">
              <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-mist-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <aside className="mt-8 flex gap-4 rounded-[1.5rem] bg-mist-100 p-6">
          <Icon name="lightbulb" size={22} className="mt-0.5 shrink-0 text-mist-600" />
          <p className="text-deep-900">{block.text}</p>
        </aside>
      )
    case 'img':
      // Ảnh Ecopillo thêm vào bài dựng sẵn ở Nội dung web
      return (
        <figure className="mt-8">
          <img
            src={block.image.src}
            srcSet={block.image.srcSet || undefined}
            sizes="(min-width: 1024px) 832px, 100vw"
            alt={block.image.alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-full rounded-[1.5rem]"
          />
          {block.caption && <figcaption className="mt-2 text-body-sm text-ink-faint">{block.caption}</figcaption>}
        </figure>
      )
    case 'quote':
      return (
        <blockquote className="font-display mt-8 border-l-2 border-mist-600 pl-5 text-[1.25rem] leading-snug text-deep-900 italic">
          {block.text}
        </blockquote>
      )
    default:
      return <p className="mt-5">{block.text}</p>
  }
}

/**
 * Trang một bài viết, nằm ở gốc web như WordPress cũ (ecopillo.com.vn/ten-bai/).
 * Bài WordPress: tiêu đề và mô tả Yoast như web cũ, ảnh chia sẻ là ảnh bìa trên WordPress, thân bài nạp riêng.
 * Đường link không khớp bài nào thì hiện trang 404.
 */
export function ArticlePage() {
  const { slug } = useParams()
  const post = anyPostBySlug(slug)
  const { pathname } = useLocation()
  // Ảnh bìa từ Thư viện WordPress (bài WordPress, hoặc bài dựng sẵn Ecopillo đổi ảnh bìa): dùng thẳng làm ảnh chia sẻ
  const share = post && post.cover.src.startsWith('https://') ? { path: post.cover.src, alt: post.cover.alt } : post && shareImageOf(post.cover)
  const description = post && (post.wp?.description ?? post.seoDescription ?? post.excerpt)
  usePageMeta(
    post ? (post.wp?.metaTitle ?? post.title) : 'Không tìm thấy trang',
    description,
    post ? { image: share, type: 'article' } : { notFound: true },
  )
  if (!post) return <NotFoundPage />

  // Bài khác: cùng nhóm trước, mới nhất trước
  const others = [
    ...ALL_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...ALL_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 2)

  return (
    <div className="pb-24">
      <Container className="pt-10 sm:pt-14">
        {/* Máy tính rộng hơn (anh Quang 18/11/2026: "phần bài viết em cho hiển thị chiều ngang to hơn trên máy tính") */}
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <JsonLd
            data={articleLd({
              title: post.title,
              description: description ?? post.excerpt,
              path: pathname,
              image: post.cover,
              published: post.wp?.date,
              modified: post.wp?.modified,
            })}
          />
          <Breadcrumb items={[{ label: BLOG_TEXT.duongDan, to: PATHS.blog }, { label: post.category }]} current={post.title} />
          <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-meta text-ink-soft">
            <Link to={`${PATHS.blog}?chu-de=${encodeURIComponent(post.category)}`} className="font-medium tracking-[0.12em] text-mist-600 uppercase hover:underline">
              {post.category}
            </Link>
            <span aria-hidden>·</span>
            <span>{chen(BLOG_TEXT.phutDoc, { so: post.readMinutes })}</span>
            {post.wp && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.wp.date}>{formatPostDate(post.wp.date)}</time>
              </>
            )}
          </p>
          <h1 className="font-display mt-4 text-[2.2rem] leading-[1.1] text-deep-900 sm:text-[3rem]">{post.title}</h1>
          <p className="mt-5 text-lead leading-relaxed text-ink-soft">{post.excerpt}</p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem]">
          <div className="aspect-[16/9]">
            <Placeholder className="h-full w-full !rounded-none border-0" note={post.title} image={post.cover} sizes="(min-width: 1024px) 1024px, 100vw" priority />
          </div>
        </div>

        <div className="chu-deu mx-auto mt-4 max-w-3xl lg:max-w-4xl">
          {/*
           * Thân bài trên khối trắng, chữ 16px chàm nhạt, chữ nhấn bằng màu (anh Quang 18/11/2026: "phần chữ nó nhẹ nhàng như cái
           * nền trắng anh gửi"; owner chọn phương án B trong docs/de-xuat-chu-bai-viet-18-11.html). Kiểu chữ thân bài WordPress: .bai-wp
           */}
          <article className="rounded-[2rem] bg-ivory px-5 py-7 text-base leading-[1.75] text-ink-soft shadow-[var(--shadow-soft)] sm:px-10 sm:py-10 lg:px-14 lg:py-12 [&>:first-child]:mt-0">
            {post.wp ? (
              <WordPressBody slug={post.slug} live={post.wp.live ? { title: post.title } : undefined} />
            ) : (
              post.body.map((block, i) => <Block key={i} block={block} />)
            )}
          </article>

          {post.related && (
            <div className="mt-12 border-t border-line pt-8">
              <p className="eyebrow">{BLOG_TEXT.quanTam}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {post.related.map((r, i) => (
                  <li key={`${i}-${r.to}`}>
                    <Link
                      to={r.to}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-4 py-2 text-body-sm text-deep-800 transition-colors hover:bg-mist-200"
                    >
                      {r.label}
                      <Icon name="arrowRight" size={14} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 rounded-[1.75rem] bg-cream-50 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <p className="font-display text-[1.4rem] leading-tight text-deep-900">{COMMON_TEXT.canTuVan}</p>
            <p className="mt-1.5 text-body-sm text-ink-soft">{COMMON_TEXT.canTuVanChu}</p>
            <ContactButtons size="md" stretch className="mt-5" />
          </div>
        </div>
      </Container>

      {others.length > 0 && (
        <Container className="mt-16 sm:mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-[1.8rem] text-deep-900 sm:text-[2.2rem]">{BLOG_TEXT.baiKhac}</h2>
            <Link to={PATHS.blog} className="inline-flex items-center gap-1 text-sm font-medium text-deep-800 hover:underline">
              {BLOG_TEXT.tatCaBai} <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container>
        <ExploreMore groups={relatedForPost(post)} />
      </Container>
    </div>
  )
}
