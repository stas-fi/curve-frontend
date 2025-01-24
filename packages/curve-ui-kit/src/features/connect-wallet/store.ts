import { create, type StateCreator } from 'zustand'
import type { OnboardAPI, UpdateNotification, WalletState as Wallet } from '@web3-onboard/core'
import { BrowserProvider } from 'ethers'
import type { NotificationType } from '@web3-onboard/core/dist/types'
import { initOnboard } from './lib/init'
import { devtools } from 'zustand/middleware'
import type { Address } from 'abitype'
import type { EIP1193Provider } from '@web3-onboard/common'
import { logSuccess } from '@ui-kit/lib'

type WalletState = {
  onboard: OnboardAPI | null
  provider: BrowserProvider | null
  rpcProvider: EIP1193Provider | null
  wallet: Wallet | null
}

type WalletActions = {
  notify(
    message: string,
    type: NotificationType,
    autoDismiss?: number,
  ): {
    dismiss: () => void
    update: UpdateNotification | undefined
  }
  getProvider(): BrowserProvider | null
  chooseWallet(wallet: Wallet | null): Promise<void>
  initialize(...params: Parameters<typeof initOnboard>): void
}

export type WalletStore = WalletState & WalletActions

const DEFAULT_STATE: WalletState = {
  onboard: null,
  provider: null,
  rpcProvider: null,
  wallet: null,
}

const walletStore: StateCreator<WalletStore> = (set, get): WalletStore => ({
  ...DEFAULT_STATE,
  notify: (message, type = 'pending', autoDismiss) => {
    const { onboard } = get()
    if (!onboard) {
      throw new Error('Onboard not initialized')
    }
    return onboard.state.actions.customNotification({
      type,
      message,
      ...(typeof autoDismiss !== 'undefined' && { autoDismiss }),
    })
  },
  getProvider: () => {
    const { wallet } = get()
    return wallet && new BrowserProvider(wallet.provider)
  },
  chooseWallet: async (wallet: Wallet | null) => {
    const { provider, chooseWallet } = get()
    await provider?.removeAllListeners()
    return set(createProvider(wallet, chooseWallet))
  },
  initialize: async (locale, themeType, networks) => {
    const { chooseWallet } = get()
    const onboard = initOnboard(locale, themeType, networks)
    const wallet = onboard.state.get().wallets?.[0]
    return set({ onboard, ...createProvider(wallet, chooseWallet) })
  },
})

export const useWalletStore =
  process.env.NODE_ENV === 'development' ? create(devtools(walletStore)) : create(walletStore)

function getRpcProvider(wallet: Wallet): EIP1193Provider {
  if ('isTrustWallet' in wallet.provider && window.ethereum) {
    // unable to connect to curvejs with wallet.provider
    return window.ethereum as any // todo: why do we need any here?
  }
  if ('isExodus' in wallet.provider && typeof window.exodus.ethereum !== 'undefined') {
    return window.exodus.ethereum
  }
  return wallet.provider
}

function createProvider(wallet: Wallet | null | undefined, chooseWallet: (wallet: Wallet | null) => Promise<void>) {
  if (!wallet) return { rpcProvider: null, wallet: null, provider: null }
  const rpcProvider = getRpcProvider(wallet)
  rpcProvider.on('accountsChanged', (newAccounts: Address[]) => {
    logSuccess('accountsChanged', newAccounts)
    return chooseWallet(newAccounts.length === 0 ? null : wallet)
  })
  return { rpcProvider, wallet, provider: new BrowserProvider(wallet.provider) }
}
