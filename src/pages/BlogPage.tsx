import { useSearchParams } from 'react-router-dom'
import { PostCard } from '../components/blog/PostCard'
import { PageHero } from '../components/ui/PageHero'
import { Container } from '../components/ui/primitives'
import { POST_CATEGORIES, POSTS, type PostCategory } from '../data/posts'
import { usePageMeta } from '../hooks/usePageMeta'
import { revealDelay } from '../lib/reveal'

/** Trang Tin tức: danh sách bài viết, lọc theo chủ đề (?chu-de=…) */
export function BlogPage() {
  usePageMeta('Tin tức, cẩm nang giấc ngủ', 'Kiến thức về vải Lyocell, cách chọn kích thước chăn ga, giặt và bảo quản để giấc ngủ luôn êm, mát.')
  const [params, setParams] = useSearchParams()
  const active = POST_CATEGORIES.find((c) => c === params.get('chu-de')) ?? null
  const posts = active ? POSTS.filter((p) => p.category === active) : POSTS
  const [first, ...rest] = posts

  const choose = (c: PostCategory | null) => setParams(c ? { 'chu-de': c } : {}, { replace: true })

  return (
    <div className="pb-24">
      <PageHero
        crumbs={[{ label: 'Tin tức' }]}
        eyebrow="Tin tức · Cẩm nang"
        title={
          <>
            Cẩm nang
            <br />
            cho giấc ngủ ngon
          </>
        }
        lead="Hiểu về chất liệu, chọn đúng kích thước và chăm sóc chăn ga gối đệm để dùng bền, ngủ êm."
      >
      </PageHero>

      <Container className="mt-10 sm:mt-14">
        <div role="group" aria-label="Chủ đề" className="flex flex-wrap gap-2">
          {[null, ...POST_CATEGORIES].map((c) => (
            <button
              key={c ?? 'all'}
              type="button"
              aria-pressed={active === c}
              onClick={() => choose(c)}
              className={`rounded-full px-4 py-2 text-small transition ${
                active === c ? 'bg-deep-800 text-ivory' : 'bg-cream-50 text-deep-900 ring-1 ring-cream-200 hover:ring-deep-700/40'
              }`}
            >
              {c ?? 'Tất cả'}
            </button>
          ))}
        </div>

        {first && (
          <div data-reveal className="mt-8">
            <PostCard post={first} feature />
          </div>
        )}
        {rest.length > 0 && (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <li key={p.slug} data-reveal style={revealDelay(i)}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  )
}
