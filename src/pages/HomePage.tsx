import { About } from '../components/home/About'
import { Collections } from '../components/home/Collections'
import { BrandVideo } from '../components/home/BrandVideo'
import { BrandStory, TrustStrip } from '../components/home/Craft'
import { SocialStrip } from '../components/home/SocialLinks'
import { Essentials, Gifts } from '../components/home/Essentials'
import { Hero } from '../components/home/Hero'
import { Hospitality } from '../components/home/Hospitality'
import { Reviews } from '../components/home/Reviews'
import { Faq, Showrooms } from '../components/home/Showrooms'
import { usePageMeta } from '../hooks/usePageMeta'

export function HomePage() {
  usePageMeta(null)
  return (
    <>
      <Hero />
      <TrustStrip />
      <About moreLink />
      <BrandVideo />
      <BrandStory />
      <Collections />
      <Essentials />
      <Gifts />
      <Hospitality />
      <Reviews />
      <SocialStrip />
      <Showrooms />
      <Faq />
    </>
  )
}
