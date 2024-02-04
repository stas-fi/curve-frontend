import type { CustomNotification, NotificationType } from '@web3-onboard/core/dist/types'
import type { GetState, SetState } from 'zustand'
import type { OnboardAPI, UpdateNotification } from '@web3-onboard/core'
import type { State } from '@/store/useStore'

import { ethers, isError } from 'ethers'
import cloneDeep from 'lodash/cloneDeep'

import { CONNECT_STAGE } from '@/constants'

type StateKey = keyof typeof DEFAULT_STATE

type SliceState = {
  onboard: OnboardAPI | null
  provider: Provider | null
}

const sliceKey = 'wallet'

// prettier-ignore
export type WalletSlice = {
  [sliceKey]: SliceState & {
    notifyNotification(message: string, type: NotificationType, autoDismiss?: number): ({ dismiss: () => void; update: UpdateNotification | undefined })
    updateConnectWalletStateKeys(): void
    updateProvider(wallet: Wallet | null): Promise<void>
    getProvider(sliceKey: 'quickSwap' | 'poolDeposit' | 'poolWithdraw' | 'poolSwap' | 'dashboard' | 'lockedCrv'): Provider | null

    setStateByActiveKey<T>(key: StateKey, activeKey: string, value: T): void
    setStateByKey<T>(key: StateKey, value: T): void
    setStateByKeys(SliceState: Partial<SliceState>): void
    resetState(): void
  }
}

const DEFAULT_STATE: SliceState = {
  onboard: null,
  provider: null,
}

const createWalletSlice = (set: SetState<State>, get: GetState<State>): WalletSlice => ({
  [sliceKey]: {
    ...DEFAULT_STATE,
    notifyNotification: (message, type = 'pending', autoDismiss) => {
      const onboard = get().wallet.onboard

      if (onboard) {
        // see https://onboard.blocknative.com/docs/packages/core#options for all options
        const customNotification: CustomNotification = {
          type,
          message,
        }

        if (typeof autoDismiss !== 'undefined') {
          customNotification.autoDismiss = autoDismiss
        }

        return onboard.state.actions.customNotification(customNotification)
      } else {
        return { dismiss: () => {}, update: undefined }
      }
    },
    updateConnectWalletStateKeys: () => {
      get().updateConnectState('loading', CONNECT_STAGE.CONNECT_WALLET, [''])
    },
    updateProvider: async (wallet) => {
      try {
        const storedProvider = get().wallet.provider
        const newProvider = wallet ? getProvider(wallet) : null
        if (storedProvider) await storedProvider.removeAllListeners()
        get().wallet.setStateByKey('provider', newProvider)
      } catch (error) {
        if (!isError(error, 'NETWORK_ERROR')) {
          console.error(error)
        }
      }
    },
    getProvider: (sliceKey) => {
      const provider = get().wallet.provider
      if (!provider) {
        const storedFormStatus = get()[sliceKey]?.formStatus
        if (
          storedFormStatus &&
          typeof storedFormStatus === 'object' &&
          'step' in storedFormStatus &&
          'formProcessing' in storedFormStatus &&
          'error' in storedFormStatus
        ) {
          get()[sliceKey].setStateByKey('formStatus', {
            ...storedFormStatus,
            step: '',
            formProcessing: false,
            error: 'error-invalid-provider',
          })
        }
      }
      return provider
    },

    // slice helpers
    setStateByActiveKey: (key, activeKey, value) => {
      get().setAppStateByActiveKey(sliceKey, key, activeKey, value)
    },
    setStateByKey: (key, value) => {
      get().setAppStateByKey(sliceKey, key, value)
    },
    setStateByKeys: (sliceState) => {
      get().setAppStateByKeys(sliceKey, sliceState)
    },
    resetState: () => {
      get().resetAppState(sliceKey, cloneDeep(DEFAULT_STATE))
    },
  },
})

export default createWalletSlice

export function getProvider(wallet: Wallet) {
  return new ethers.BrowserProvider(wallet.provider)
}

export function getWalletChainId(wallet: Wallet | undefined | null) {
  if (!wallet) return null
  const chainId = wallet.chains[0].id
  return Number(BigInt(chainId).toString())
}

export function getWalletSignerAddress(wallet: Wallet | undefined | null) {
  if (!wallet) return ''
  return wallet.accounts[0]?.address
}
