import { CONTACT_SET, SHOWROOM_SET, SOCIAL_SET } from './brand'
import { ABOUT_SET } from './about'
import { FAQS_SET, PARTNERS_SET, REVIEWS_SET } from './content'
import { CORPORATE_GIFTS_SET } from './corporateGifts'
import { AGENT_SET } from './dealers'
import { FEATURED_EVENT_SET, MAJOR_EVENTS_SET, OTHER_EVENTS_SET } from './events'
import { BANNER_GROUPS_SET, BANNER_SET } from './heroBanner'
import { HOTEL_SET } from './hotel'
import type { EditableSet } from './liveContent'
import { POLICY_HEAD_SET, POLICY_SECTION_SETS } from './policies'
import { PRESS_SET } from './press'
import { LISTING_PRODUCTS_SET } from './listingProducts'
import { PRODUCT_COMMON_SET } from './productCommonInfo'
import { PRODUCT_MENU_SET } from './productMenu'
import { ABOUT_MORE_SET } from './about'
import { BRAND_VIDEO_SET } from './brand'
import { COLLECTION_SHOWCASE_SET } from './collectionGroups'
import { HOTEL_PAGE_SET } from './hotel'
import { LISTING_HEAD_SET } from './links'
import { LISTING_GUIDES_SET } from './listingGuides'
import { MATTRESS_TEXT_SET } from './mattressPicker'
import { ABOUT_PAGE_TEXT_SET } from './pageText/aboutPage'
import { BLOG_TEXT_SET } from './pageText/blog'
import { COMMON_TEXT_SET } from './pageText/common'
import { CONTACT_PAGE_TEXT_SET } from './pageText/contact'
import { FAQ_PAGE_TEXT_SET } from './pageText/faq'
import { FOOTER_TEXT_SET } from './pageText/footer'
import { GIFTS_TEXT_SET } from './pageText/gifts'
import { HOME_TEXT_SET } from './pageText/home'
import { ORDER_TEXT_SET } from './pageText/order'
import { ORDER_CUSTOMER_TEXT_SET, ORDER_STEPS_TEXT_SET, ORDER_SUMMARY_TEXT_SET } from './pageText/orderFlow'
import { PRIVACY_SECTIONS_SET, PRIVACY_TEXT_SET } from './pageText/privacy'
import { PRODUCTS_PAGE_TEXT_SET } from './pageText/products'
import { PRODUCT_LABELS_SET } from './pageText/productLabels'
import { COLLECTION_PAGE_TEXT_SET, PRODUCT_DETAIL_TEXT_SET, PRODUCT_LIST_TEXT_SET } from './pageText/productUi'
import { RECRUIT_TEXT_SET } from './pageText/recruit'
import { THANK_YOU_SET } from './thankYou'
import { FONT_SET, THEME_SET } from './theme'
import { LAYOUT_SETS } from './pageLayout'
import { REDIRECT_SET } from './liveRedirects'
import { SEO_SET } from './liveSeo'
import { PRICE_BAND_SETS } from './priceBands'
import { SHELF_SET } from './productShelves'
import { LISTING_ORDER_SET } from './listingProducts'
import { TONE_SET } from './stories'
import { POST_TOPIC_SET } from './postSections'
import { CATALOG_TEXT_SET } from './pageText/catalogText'
import { PRODUCT_COPY_SET } from './pageText/productCopy'
import { MISC_LABELS_SET } from './pageText/miscLabels'
import { CODE_POST_SETS } from './posts'
import { SHIPPING_SET } from '../lib/shipping'
import { SITE_ICONS_SET } from './siteIcons'
import { STOCK_TEXT_SET } from './pageText/stock'
import { POLICY_NAV_TEXT_SET } from './policyNav'
import { HOME_COLLECTIONS_SET } from './collectionGroups'
import { PRODUCT_MENU_TEXT_SET } from './productMenu'
import { SEARCH_PAGES_SET, SEARCH_TEXT_SET } from './pageText/search'
import { MAIN_MENU_SET } from './pageText/mainMenu'
import { CONTACT_DOCK_TEXT_SET } from './pageText/contactDock'
import { PAGE_FRAME_TEXT_SET } from './pageText/pageFrame'
import { DEALER_TEXT_SET } from './pageText/dealers'
import { NOT_FOUND_TEXT_SET } from './pageText/notFound'
import { HEADER_TEXT_SET } from './pageText/header'

/**
 * Mọi bộ dữ liệu Ecopillo tự sửa trong WordPress (liveContent.ts), theo thứ tự hiện trên menu "Nội dung web".
 * tools/dung-san-html.mjs ghi ra dist/noi-dung-goc.json; tools/dong-goi-plugin.mjs chuyển vào plugin (du-lieu/, ngoài site/);
 * plugin (noi-dung.php) dựng màn hình sửa từ đó. Thêm bộ mới: khai EditableSet cạnh dữ liệu rồi thêm vào đây.
 */
export const CONTENT_SETS: readonly EditableSet[] = [
  CONTACT_SET,
  SOCIAL_SET,
  SHOWROOM_SET,
  AGENT_SET,
  BANNER_SET,
  BANNER_GROUPS_SET,
  FEATURED_EVENT_SET,
  OTHER_EVENTS_SET,
  MAJOR_EVENTS_SET,
  PRESS_SET,
  REVIEWS_SET,
  ABOUT_SET,
  HOTEL_SET,
  PARTNERS_SET,
  CORPORATE_GIFTS_SET,
  FAQS_SET,
  POLICY_HEAD_SET,
  ...POLICY_SECTION_SETS,
  PRIVACY_TEXT_SET,
  PRIVACY_SECTIONS_SET,
  PRODUCT_COMMON_SET,
  PRODUCT_MENU_SET,
  LISTING_PRODUCTS_SET,
  LISTING_ORDER_SET,
  SHELF_SET,
  ...PRICE_BAND_SETS,
  TONE_SET,
  POST_TOPIC_SET,
  // Chữ từng trang (owner 20/11/2026: "đảm bảo tất cả mọi thứ trên web, khách đều tự chỉnh sửa được")
  HOME_TEXT_SET,
  MATTRESS_TEXT_SET,
  COLLECTION_SHOWCASE_SET,
  HOME_COLLECTIONS_SET,
  THANK_YOU_SET,
  BRAND_VIDEO_SET,
  ABOUT_PAGE_TEXT_SET,
  ABOUT_MORE_SET,
  HOTEL_PAGE_SET,
  GIFTS_TEXT_SET,
  RECRUIT_TEXT_SET,
  CONTACT_PAGE_TEXT_SET,
  DEALER_TEXT_SET,
  PRODUCTS_PAGE_TEXT_SET,
  PRODUCT_LIST_TEXT_SET,
  PRODUCT_LABELS_SET,
  CATALOG_TEXT_SET,
  PRODUCT_COPY_SET,
  MISC_LABELS_SET,
  PRODUCT_DETAIL_TEXT_SET,
  STOCK_TEXT_SET,
  COLLECTION_PAGE_TEXT_SET,
  LISTING_HEAD_SET,
  LISTING_GUIDES_SET,
  ORDER_TEXT_SET,
  ORDER_STEPS_TEXT_SET,
  ORDER_CUSTOMER_TEXT_SET,
  ORDER_SUMMARY_TEXT_SET,
  SHIPPING_SET,
  BLOG_TEXT_SET,
  ...CODE_POST_SETS,
  FAQ_PAGE_TEXT_SET,
  HEADER_TEXT_SET,
  PRODUCT_MENU_TEXT_SET,
  FOOTER_TEXT_SET,
  CONTACT_DOCK_TEXT_SET,
  SEARCH_TEXT_SET,
  PAGE_FRAME_TEXT_SET,
  POLICY_NAV_TEXT_SET,
  NOT_FOUND_TEXT_SET,
  COMMON_TEXT_SET,
  // Màu web (owner 20/11/2026 "ecopillo cần tự làm hết được")
  THEME_SET,
  FONT_SET,
  MAIN_MENU_SET,
  SEARCH_PAGES_SET,
  ...LAYOUT_SETS,
  REDIRECT_SET,
  // SEO từng trang (đợt E 24/11/2026)
  SEO_SET,
  SITE_ICONS_SET,
]

export const buildContentFrame = (): { boDuLieu: readonly EditableSet[] } => ({ boDuLieu: CONTENT_SETS })
