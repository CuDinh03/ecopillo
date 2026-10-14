import { Link } from 'react-router-dom'
import { postPath, type Post } from '../../data/posts'
import { Icon } from '../ui/Icon'
import { Placeholder } from '../ui/Placeholder'

/** Thẻ bài viết; feature = bài nổi bật nằm ngang ở đầu danh sách */
export function PostCard({ post, feature = false }: { post: Post; feature?: boolean }) {
  return (
    <article
      className={`group relative flex h-full overflow-hidden rounded-[1.75rem] bg-ivory ring-1 ring-cream-200 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${
        feature ? 'flex-col lg:grid lg:grid-cols-2' : 'flex-col'
      }`}
    >
      <div className={feature ? 'aspect-[16/10] lg:aspect-auto lg:min-h-[340px]' : 'aspect-[16/10]'}>
        <Placeholder
          className="h-full w-full !rounded-none border-0 transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]"
          note={post.title}
          image={post.cover}
          sizes={feature ? '(min-width: 1024px) 600px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
        />
      </div>
      <div className={`flex flex-1 flex-col ${feature ? 'p-7 sm:p-10 lg:justify-center' : 'p-6 sm:p-7'}`}>
        <p className="flex items-center gap-2 text-[0.78rem] text-ink-soft">
          <span className="font-medium tracking-[0.12em] text-mist-600 uppercase">{post.category}</span>
          <span aria-hidden>·</span>
          <span>{post.readMinutes} phút đọc</span>
        </p>
        <h3
          className={`font-display mt-3 leading-tight text-deep-900 ${feature ? 'text-[1.8rem] sm:text-[2.2rem]' : 'text-[1.35rem]'}`}
        >
          <Link to={postPath(post)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className={`mt-3 leading-relaxed text-ink-soft ${feature ? 'text-[1rem]' : 'line-clamp-3 text-[0.92rem]'}`}>{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-[0.88rem] font-medium text-deep-800">
          Đọc bài <Icon name="arrowRight" size={15} className="transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  )
}
