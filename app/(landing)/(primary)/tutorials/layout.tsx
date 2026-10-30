import type { Metadata } from 'next'
import { PAGE_SETTINGS } from '@landing/constants/Global'
import { buildPageMetadata } from '@landing/lib/seo/page-metadata'

export const metadata: Metadata = buildPageMetadata(PAGE_SETTINGS.tutorials)

const TutorialsLayout = ({ children }: { children: React.ReactNode }) => {
  return children
}

export default TutorialsLayout
