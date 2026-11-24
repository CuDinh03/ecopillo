import { COLLECTIONS } from './catalog'
import { collectionPathById, isListingShown, LISTINGS, PATHS, productsUrl } from './links'
import { chen } from './pageText/define'
import { isMenuLink } from './pageText/linkField'
import { PAGE_FRAME_TEXT as T } from './pageText/pageFrame'
import { POLICY_PAGE_LINKS } from './policyNav'
import { POSTS, postPath, type Post } from './posts'
import { PRODUCTS, priceLabel, productPath, type CategoryId, type Product } from './products'

/**
 * Khối "Khám phá thêm" ở cuối trang: link qua lại giữa sản phẩm, danh mục, bài viết, chính sách
 * (owner duyệt 15/10/2026). Giúp khách đi tiếp, và Google thấy các trang nối với nhau như web cũ (50–68 link mỗi trang).
 * Mọi link lấy từ links.ts; thêm bài viết thì gắn `topics` cho bài trong posts.ts là tự hiện ở đúng chỗ.
 * Tên nhóm, link nhóm "Mua hàng", "Mua sắm": Ecopillo sửa ở Nội dung web (src/data/pageText/pageFrame.ts).
 */

export interface RelatedLink {
  label: string
  /** Dòng phụ ngắn, ví dụ khoảng giá hay "5 phút đọc" */
  note?: string
  to: string
}

export interface RelatedGroup {
  title: string
  links: readonly RelatedLink[]
}

/** Chủ đề nối bài viết với nhóm sản phẩm. Bài có chủ đề nào thì hiện ở trang sản phẩm nhóm đó, và ngược lại */
export type Topic = CategoryId | 'chinh-sach'

const postLink = (p: Post): RelatedLink => ({ label: p.title, note: chen(T.phutDoc, { so: p.readMinutes }), to: postPath(p) })

export const postsAbout = (topic: Topic, exceptSlug?: string): readonly Post[] =>
  POSTS.filter((p) => p.slug !== exceptSlug && p.topics?.includes(topic))

/** Danh mục nhỏ của cùng nhóm (đệm lò xo, đệm cao su…) */
const listingsOf = (category: CategoryId): RelatedLink[] =>
  Object.entries(LISTINGS)
    .filter(([path]) => isListingShown(path))
    .filter(([, l]) => l.category === category || (category === 'chan' && l.products?.some((s) => s.startsWith('chan-'))))
    .map(([to, l]) => ({ label: l.title, to }))

const CATEGORY_LINKS: Readonly<Record<CategoryId, RelatedLink>> = {
  'bo-chan-ga': { label: T.tatCaBoChanGa, to: productsUrl({ 'danh-muc': 'bo-chan-ga' }) },
  chan: { label: T.tatCaChan, to: productsUrl({ 'danh-muc': 'chan' }) },
  goi: { label: T.tatCaGoi, to: productsUrl({ 'danh-muc': 'goi' }) },
  dem: { label: T.tatCaDem, to: productsUrl({ 'danh-muc': 'dem' }) },
}

/** Dòng "chữ | link" Ecopillo sửa → link; link sai (không phải /… hay https://…) thì bỏ dòng */
const linksOf = (rows: readonly { ten: string; link: string }[]): RelatedLink[] =>
  rows.filter((r) => isMenuLink(r.link)).map((r) => ({ label: r.ten, to: r.link }))

const BUYING_GUIDE: readonly RelatedLink[] = linksOf(T.linkMuaHang)

/** Các bộ sưu tập khác (trừ bộ đang xem) */
const otherCollections = (exceptId?: string): RelatedLink[] =>
  COLLECTIONS.filter((c) => c.id !== exceptId && c.kind !== 'chan-he').map((c) => ({ label: c.name, to: collectionPathById(c.id) }))

/** Cuối trang sản phẩm lẻ, trang bộ sưu tập, trang phối màu */
export const relatedForProduct = (product: Product): readonly RelatedGroup[] => {
  const groups: RelatedGroup[] = []
  if (product.collection) groups.push({ title: T.nhomBoSuuTapKhac, links: otherCollections(product.collection.id) })
  else {
    const siblings = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug && !p.collection)
    groups.push({
      title: T.nhomCungNhom,
      links: [
        ...siblings.map((p) => ({ label: p.name, note: priceLabel(p), to: productPath(p) })),
        ...listingsOf(product.category),
        CATEGORY_LINKS[product.category],
      ],
    })
  }
  const posts = postsAbout(product.category)
  if (posts.length > 0) groups.push({ title: T.nhomCamNang, links: posts.map(postLink) })
  groups.push({ title: T.nhomMuaHang, links: BUYING_GUIDE })
  return groups
}

/** Cuối trang danh mục nhỏ (đệm lò xo, ruột chăn gối…) */
export const relatedForListing = (path: string, category?: CategoryId): readonly RelatedGroup[] => {
  const groups: RelatedGroup[] = []
  const siblings = category ? listingsOf(category).filter((l) => l.to !== path) : []
  if (siblings.length > 0) groups.push({ title: T.nhomDanhMucCungNhom, links: siblings })
  if (category === 'bo-chan-ga' || !category) groups.push({ title: T.nhomBoSuuTap, links: otherCollections() })
  const posts = category ? postsAbout(category) : []
  if (posts.length > 0) groups.push({ title: T.nhomCamNang, links: posts.map(postLink) })
  groups.push({ title: T.nhomMuaHang, links: BUYING_GUIDE })
  return groups
}

/** Số bài tối đa trong nhóm "Đọc thêm" cuối bài */
const MORE_POSTS_LIMIT = 6

/**
 * Cuối bài viết: sản phẩm theo chủ đề của bài, bài khác cùng chủ đề, chính sách.
 * `pool`: mọi bài đang hiện. Trang bài viết truyền ALL_POSTS (allPosts.ts, gồm bài WordPress, bài Ecopillo mới đăng, đã bỏ bài ẩn);
 * file này không nhập allPosts.ts để danh sách bài WordPress không vào gói chung của web (trang sản phẩm cũng dùng file này).
 * Bài cùng nhóm sản phẩm trước, rồi bài cùng mục (Tin tức hoặc cùng chủ đề Cẩm nang) theo thứ tự trang Tin tức (mới nhất trước).
 */
export const relatedForPost = (post: Post, pool: readonly Post[] = POSTS): readonly RelatedGroup[] => {
  const groups: RelatedGroup[] = []
  const productLinks = (post.topics ?? [])
    .filter((t): t is CategoryId => t !== 'chinh-sach')
    .flatMap((t) => [CATEGORY_LINKS[t], ...listingsOf(t)])
  if (productLinks.length > 0) groups.push({ title: T.nhomSanPhamLienQuan, links: productLinks })
  const others = pool.filter((p) => p.slug !== post.slug)
  const sameTopic = others.filter((p) => p.topics?.some((t) => post.topics?.includes(t)))
  const sameSection = others.filter((p) => p.category === post.category && !sameTopic.includes(p))
  const morePosts = [...sameTopic, ...sameSection].slice(0, MORE_POSTS_LIMIT)
  if (morePosts.length > 0) groups.push({ title: T.nhomDocThem, links: morePosts.map(postLink) })
  groups.push({ title: T.nhomMuaHang, links: BUYING_GUIDE })
  return groups
}

/** Cuối trang chính sách: các chính sách khác + cẩm nang mua hàng */
export const relatedForPolicy = (currentPath: string): readonly RelatedGroup[] => {
  const policies = POLICY_PAGE_LINKS.map((p) => ({ label: p.label, to: p.to })).filter((l) => l.to !== currentPath)
  const groups: RelatedGroup[] = [{ title: T.nhomChinhSachKhac, links: [...policies, { label: T.hoiDap, to: PATHS.faq }] }]
  const posts = postsAbout('chinh-sach')
  if (posts.length > 0) groups.push({ title: T.nhomCamNang, links: posts.map(postLink) })
  groups.push({ title: T.nhomMuaSam, links: linksOf(T.linkMuaSam) })
  return groups
}
