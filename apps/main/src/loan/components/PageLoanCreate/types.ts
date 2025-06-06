import { Dispatch, ReactNode, SetStateAction } from 'react'
import type { FormEstGas, FormStatus as Fs } from '@/loan/components/PageLoanManage/types'
import type { LiqRangeSliderIdx } from '@/loan/store/types'
import { ChainId, type CollateralUrlParams, LlamaApi, HealthMode, Llamma } from '@/loan/types/loan.types'
import type { Step } from '@ui/Stepper/types'

export type FormType = 'create' | 'leverage'

export type FormValues = {
  collateral: string
  collateralError: 'too-much' | string
  debt: string
  debtError: 'too-much' | string
  liqRange: string
  n: number | null
}

export type StepKey = 'APPROVAL' | 'CREATE' | ''

export interface FormStatus extends Fs {
  error: string
  warning: 'loan-exists' | string
  step: StepKey
}

export type PageLoanCreateProps = {
  curve: LlamaApi | null
  isReady: boolean
  isLeverage: boolean
  llamma: Llamma | null
  llammaId: string
  params: CollateralUrlParams
  rChainId: ChainId
  rCollateralId: string
  rFormType: string | null
}

export type FormDetailInfo = {
  activeKey: string
  activeKeyLiqRange: string
  chainId: ChainId
  curve: LlamaApi | null
  formEstGas: FormEstGas
  formValues: FormValues
  haveSigner: boolean
  healthMode: HealthMode
  isAdvanceMode: boolean
  isLeverage: boolean
  isReady: boolean
  llamma: Llamma | null
  llammaId: string
  steps: Step[]
  setHealthMode: Dispatch<SetStateAction<HealthMode>>
  updateFormValues: (updatedFormValues: FormValues) => void
}

export type FormDetailInfoLeverage = {
  collateral: string
  leverage: string
  routeName: string
  maxRange: number | null
  healthFull: string
  healthNotFull: string
  priceImpact: string
  isHighImpact: boolean
  bands: [number, number]
  prices: string[]
  error: string
  loading: boolean
}

export type FormDetailInfoSharedProps = {
  activeStep: number | null
  detailInfoLTV?: ReactNode
  isValidFormValues?: boolean
  llamma: Llamma | null
  selectedLiqRange: LiqRangeSliderIdx | undefined
  handleLiqRangesEdit(): void
  handleSelLiqRange(n: number): void
}

export type MaxRecvLeverage = {
  maxBorrowable: string
  maxCollateral: string
  leverage: string
  routeIdx: number | null
}
