import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BedDouble,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Gift,
  Grid3x3,
  HandHeart,
  Image,
  Info,
  Leaf,
  Lightbulb,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Play,
  Plus,
  Quote,
  Recycle,
  Ruler,
  ShieldCheck,
  Spool,
  Truck,
  X,
  type LucideIcon,
  type LucideProps,
  MessageCircle,
  Wind,
  Volume2,
  LocateFixed,
  Search,
  List,
  Map as MapIcon,
  Navigation,
} from 'lucide-react'

/** Bộ icon Lucide, đặt tên theo nghĩa dùng trên web */
const ICONS = {
  phone: Phone,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  check: Check,
  leaf: Leaf,
  gift: Gift,
  truck: Truck,
  shield: ShieldCheck,
  certified: BadgeCheck,
  ruler: Ruler,
  /** Chỉ may — đường may 4 mũi */
  stitch: Spool,
  /** Vải dệt — Jacquard */
  weave: Grid3x3,
  pin: MapPin,
  clock: Clock,
  mail: Mail,
  plus: Plus,
  minus: Minus,
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  building: Building2,
  quote: Quote,
  box: Package,
  info: Info,
  bed: BedDouble,
  award: Award,
  recycle: Recycle,
  lightbulb: Lightbulb,
  community: HandHeart,
  image: Image,
  play: Play,
  volume: Volume2,
  locate: LocateFixed,
  search: Search,
  list: List,
  map: MapIcon,
  navigate: Navigation,
  messenger: MessageCircle,
  air: Wind,
} satisfies Record<string, LucideIcon>

const BRAND_PATHS = {
  facebook:
    'M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8.2v3h2.5V21h2.8Z',
  tiktok:
    'M16.6 3c.3 2.3 1.6 3.8 3.9 4v2.7c-1.4.1-2.6-.3-3.9-1.1v5.8c0 3.6-2.9 6.1-6.2 5.6-4.4-.7-5.8-6.4-2.2-8.9 1-.7 2.3-1 3.6-.9v2.9c-.6-.2-1.3-.2-1.9.1-1.5.7-1.4 3 .2 3.6 1.4.5 3-.5 3-2.1V3h3.5Z',
  instagram:
    'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm4 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM17.2 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
  youtube:
    'M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z',
} as const

type BrandName = keyof typeof BRAND_PATHS

export type IconName = keyof typeof ICONS | BrandName

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) {
  if (name in BRAND_PATHS) return <BrandIcon name={name as BrandName} size={size} className={rest.className} />
  const Component = ICONS[name as keyof typeof ICONS]
  return <Component size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />
}

/** Lucide không có icon thương hiệu: vẽ dấu hiệu đơn giản, một màu */
function BrandIcon({ name, size, className }: { name: BrandName; size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path fillRule="evenodd" d={BRAND_PATHS[name]} />
    </svg>
  )
}

/** Biểu tượng Zalo dạng chữ, tránh dùng logo thương hiệu */
export function ZaloMark({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const colors = tone === 'dark' ? 'bg-deep-800 text-ivory' : 'bg-ivory text-deep-800'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 items-center rounded-[5px] px-1 text-[0.6rem] font-medium leading-none ${colors}`}
    >
      Zalo
    </span>
  )
}
