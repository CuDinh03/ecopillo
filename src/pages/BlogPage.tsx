import { PostCard } from '../components/blog/PostCard'
import { PageHero } from '../components/ui/PageHero'
import { Container } from '../components/ui/primitives'
import { useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { buttonClass } from '../components/ui/primitives'
import { ALL_POSTS } from '../data/allPosts'
import { POST_TOPICS, postGroupOf, type PostLabel } from '../data/postSections'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'
import { useHydratedSearchParams } from '../hooks/useHydratedSearchParams'
import { BLOG_TEXT } from '../data/pageText/blog'
import { Lines } from '../components/ui/Highlight'
import { chen } from '../data/pageText/define'
import { Blocks } from '../components/ui/Blocks'
import { BLOG_ORDER } from '../data/pageLayout'

/** Mỗi lần hiện thêm bao nhiêu bài (61 bài: 3 bài trong code + 58 bài WordPress, 17/11/2026) */
const PAGE_SIZE = 12

/** Nút lọc (owner 18/11/2026): Tin tức, Cẩm nang (mọi bài Cẩm nang), rồi 4 chủ đề Cẩm nang; nút không có bài thì ẩn */
const matches = (label: PostLabel, post: { category: PostLabel }): boolean =>
  label === 'Cẩm nang' ? postGroupOf(post.category) === 'Cẩm nang' : post.category === label
const LABELS: readonly PostLabel[] = (['Tin tức', 'Cẩm nang', ...POST_TOPICS] as const).filter((label) =>
  ALL_POSTS.some((p) => matches(label, p)),
)

/** Trang Tin tức: danh sách bài viết, lọc theo chủ đề (?chu-de=…), hiện dần 12 bài một */
export function BlogPage() {
  usePageMeta('Tin tức, cẩm nang giấc ngủ', BLOG_TEXT.moTaGoogle)
  const [params, setParams] = useHydratedSearchParams()
  const active = LABELS.find((c) => c === params.get('chu-de')) ?? null
  const posts = active ? ALL_POSTS.filter((p) => matches(active, p)) : ALL_POSTS
  // Đổi chủ đề thì về lại 12 bài đầu
  const [shown, setShown] = useState({ key: active, count: PAGE_SIZE })
  const count = shown.key === active ? shown.count : PAGE_SIZE
  const [first, ...rest] = posts.slice(0, count)

  const choose = (c: PostLabel | null) => setParams(c ? { 'chu-de': c } : {}, { replace: true })

  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: BLOG_TEXT.duongDan }]}
        eyebrow={BLOG_TEXT.nhan}
        title={<Lines text={BLOG_TEXT.tieuDe} />}
        lead={BLOG_TEXT.danDat}
      >
      </PageHero>

      <Container className="mt-10 sm:mt-14">
        {/* Thứ tự, ẩn / hiện các khối: Ecopillo chọn ở Nội dung web → Giao diện → Bố cục trang Tin tức (đợt E6) */}
        <Blocks
          order={BLOG_ORDER}
          blocks={{
            'chu-de': (
              <div role="group" aria-label="Chủ đề" className="mt-8 flex flex-wrap gap-2 first:mt-0">
                {[null, ...LABELS].map((c) => (
                  <button
                    key={c ?? 'all'}
                    type="button"
                    aria-pressed={active === c}
                    onClick={() => choose(c)}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-small transition ${
                      active === c ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-900 ring-1 ring-cream-200 hover:ring-deep-700/40'
                    }`}
                  >
                    {c ?? BLOG_TEXT.locTatCa}
                  </button>
                ))}
              </div>
            ),
            'bai-viet': (
              <>
                {first && (
                  <div data-reveal className="mt-8 first:mt-0">
                    <PostCard post={first} feature />
                  </div>
                )}
                {rest.length > 0 && (
                  <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((p, i) => (
                      <li key={p.slug} data-reveal style={revealDelay(i % PAGE_SIZE)}>
                        <PostCard post={p} />
                      </li>
                    ))}
                  </ul>
                )}
                {posts.length > count && (
                  <div className="mt-10 flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShown({ key: active, count: count + PAGE_SIZE })}
                      className={buttonClass('secondary', 'lg')}
                    >
                      {BLOG_TEXT.xemThem}
                      <Icon name="chevronDown" size={18} />
                    </button>
                    <p className="text-meta text-ink-soft">
                      {chen(BLOG_TEXT.dangXem, { so: count, tong: posts.length })}
                    </p>
                  </div>
                )}
              </>
            ),
          }}
        />
      </Container>
    </div>
  )
}
