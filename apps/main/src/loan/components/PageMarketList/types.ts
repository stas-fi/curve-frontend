import { SEARCH_TERM } from '@/loan/hooks/useSearchTermMapper'
import {
  ChainId,
  LlamaApi,
  CollateralDataCacheOrApi,
  LoanDetails,
  TitleKey,
  TitleMapper,
  type CollateralUrlParams,
} from '@/loan/types/loan.types'
import type { TheadSortButtonProps } from '@ui/Table/TheadSortButton'

export type FormStatus = {
  error: string
  isLoading: boolean
  noResult: boolean
}

export type SearchTermKey = keyof typeof SEARCH_TERM
export type SearchTermMapper = Record<SearchTermKey, { label?: string; isTokenAddress?: boolean }>
export type SearchTermsResult = { [collateralId: string]: { [key: string]: { value: string } } }
export type Order = 'desc' | 'asc'

export type SearchParams = {
  searchText: string
  sortBy: TitleKey | ''
  sortByOrder: Order
}

export type PageCollateralList = {
  rChainId: ChainId
  params: CollateralUrlParams
  curve: LlamaApi | null
  pageLoaded: boolean
  searchParams: SearchParams
  searchTermMapper: SearchTermMapper
  titleMapper: TitleMapper
  onSearch(updatedSearchParams: Partial<SearchParams>): void
}

export type TableRowProps = {
  className?: string
  rChainId: ChainId
  collateralId: string
  collateralDataCachedOrApi: CollateralDataCacheOrApi
  loanDetails: Partial<LoanDetails> | undefined
  loanExists: boolean | undefined
  searchParams: SearchParams
  titleMapper: TitleMapper
  handleCellClick(): void
}

export type TableLabel = {
  titleKey: TitleKey
  className: string
  show?: boolean
  width?: string
  indicatorPlacement?: TheadSortButtonProps<TitleKey>['indicatorPlacement']
}
