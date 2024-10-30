import type { ConnectState } from 'ui/src/utils'
import type { ThemeType } from 'ui/src/Select/SelectThemes'

import React from 'react'
import { Address } from 'curve-ui-kit/src/shared/ui/AddressLabel'

export type PageWidth =
  | 'page-wide'
  | 'page-large'
  | 'page-medium'
  | 'page-small'
  | 'page-small-x'
  | 'page-small-xx'
  | null

export type Locale = 'en' | 'zh-Hans' | 'zh-Hant' | 'pseudo'

export type AppNavAdvancedMode = {
  isAdvanceMode: boolean
  handleClick(): void
}

export type AppNavConnect = {
  connectState: ConnectState
  walletSignerAddress: Address | undefined
  handleClick: () => void
}

export type AppNavLocale = {
  locale: Locale
  locales: { name: string; value: Locale; lang: string }[]
  handleChange: (selectedLocale: React.Key) => void
}

export const AppNames = ['main', 'lend', 'crvusd'] as const
export type AppName = typeof AppNames[number]

export type AppPage = {
  route: string
  label: string
  isActive?: boolean
  target?: '_self' | '_blank'
  groupedTitle?: string
  minWidth?: string
}

export type AppNavPages = {
  pages: AppPage[]
  getPath: (route: string) => string
  handleClick: (route: string) => void
}

export type AppNavSections = {
  id: string
  title: string
  links?: AppPage[]
  comp?: React.ReactNode
}[]

export type AppNavStats = { label: string; value: string }[]

export type AppNavTheme = {
  themeType: ThemeType
  handleClick: (themeType: ThemeType) => void
}

export type AppNavMobileProps = {
  connect: AppNavConnect
  advancedMode?: AppNavAdvancedMode
  locale?: AppNavLocale
  pageWidth: PageWidth
  pages: AppNavPages
  currentApp: AppName
  sections: AppNavSections
  selectNetwork: React.ReactNode
  stats: AppNavStats
  theme: AppNavTheme
}

export type AppNavSecondaryProps = {
  advancedMode?: AppNavAdvancedMode
  appsLinks: AppPage[]
  appStats: AppNavStats
  locale?: AppNavLocale
  theme: AppNavTheme
}
