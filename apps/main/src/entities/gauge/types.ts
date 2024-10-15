/**
 * @file entities/gauge/types.ts
 * @description This file defines TypeScript types and interfaces related to gauges in the Curve.fi DApp.
 * It's part of the 'gauge' entity in the FSD architecture.
 *
 * The types defined here are used throughout the gauge-related components and functions,
 * ensuring type safety and consistency in gauge operations.
 *
 * These types are essential for maintaining a well-typed codebase and improving
 * developer experience when working with gauge-related functionality.
 */

import type { PoolTemplate } from '@curvefi/api/lib/pools'
import type { Address } from 'viem'
import { gaugeKeys } from '@/entities/gauge/model'
import type { PoolQueryParams } from '@/entities/pool/types'
import { ValidatedData } from '@/shared/lib/validation'
import type { ExtractQueryKeyType } from '@/shared/types'
import type { NestedFunction, NestedKeys } from '@/shared/types'

export type PoolMethodResult<M extends NestedKeys<PoolTemplate>> = Awaited<ReturnType<NestedFunction<PoolTemplate, M>>>

export type PoolMethodParameters<M extends NestedKeys<PoolTemplate>> = Parameters<NestedFunction<PoolTemplate, M>>

export type GaugeQueryKeyType<K extends keyof typeof gaugeKeys> = ExtractQueryKeyType<typeof gaugeKeys, K>

export type GaugeQueryParams = PoolQueryParams & {}

// todo: this is repeated, get rid of ValidatedData when possible
export type GaugeStatusQueryParams = ValidatedData<GaugeQueryParams>

export type AddRewardParams = {
  rewardTokenId?: Address //T[0]
  distributorId?: Address //T[1]
}

export type DepositRewardApproveParams<T extends Array<any> = PoolMethodParameters<'gauge.depositRewardApprove'>> = {
  rewardTokenId?: Address //T[0]
  amount?: T[1]
}

export type DepositRewardParams<T extends Array<any> = PoolMethodParameters<'gauge.depositReward'>> = {
  rewardTokenId?: Address //T[0]
  amount?: T[1]
  epoch?: T[2]
}

export type CombinedGaugeParams = GaugeQueryParams & AddRewardParams & DepositRewardApproveParams & DepositRewardParams
