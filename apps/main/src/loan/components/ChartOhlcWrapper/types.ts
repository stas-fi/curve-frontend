import type { LlammaControllerEvent } from '@ui/Chart/types'
import { ChainId, Llamma } from '@/loan/types/loan.types'
import { LlammaTrade } from '@curvefi/prices-api/llamma'

export type LlammaLiquidityCoins = {
  crvusd: {
    symbol: string
    address: string
  }
  collateral: {
    symbol: string
    address: string
  }
} | null

export interface ChartOhlcWrapperProps {
  rChainId: ChainId
  llamma: Llamma | null
  llammaId: string
}

export interface LiqudityDataProps {
  llammaControllerData: LlammaControllerEvent[]
  chainId: ChainId
  coins: LlammaLiquidityCoins
}

export interface TradesDataProps {
  llammaTradesData: LlammaTrade[]
  chainId: ChainId
}
