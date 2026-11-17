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
]

export const buildContentFrame = (): { boDuLieu: readonly EditableSet[] } => ({ boDuLieu: CONTENT_SETS })
