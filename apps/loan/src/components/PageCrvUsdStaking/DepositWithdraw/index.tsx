import { SubNavItem } from '@/components/PageCrvUsdStaking/components/SubNav/types'
import { DepositWithdrawModule } from '@/components/PageCrvUsdStaking/types'
import { useEffect } from 'react'
import styled from 'styled-components'

import useStore from '@/store/useStore'
import { SUB_NAV_ITEMS } from '@/components/PageCrvUsdStaking/DepositWithdraw/constants'

import SubNav from '@/components/PageCrvUsdStaking/components/SubNav'
import TransactionDetails from '@/components/PageCrvUsdStaking/TransactionDetails'
import DepositModule from '@/components/PageCrvUsdStaking/DepositWithdraw/DepositModule'
import WithdrawModule from '@/components/PageCrvUsdStaking/DepositWithdraw/WithdrawModule'
import DeployButton from '@/components/PageCrvUsdStaking/DepositWithdraw/DeployButton'

type DepositWithdrawProps = {
  className?: string
}

const DepositWithdraw = ({ className }: DepositWithdrawProps) => {
  const { stakingModule, setStakingModule, previewAction, inputAmount, setPreviewReset } = useStore(
    (state) => state.scrvusd,
  )
  const { depositApprove: estimateGasDepositApprove, deposit: estimateGasDeposit } = useStore(
    (state) => state.scrvusd.estimateGas,
  )
  const { lendApi, curve, curve: chainId } = useStore((state) => state)

  const setNavChange = (key: SubNavItem['key']) => {
    setStakingModule(key as DepositWithdrawModule)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lendApi && curve && inputAmount !== 0) {
        estimateGasDepositApprove(inputAmount)
        estimateGasDeposit(inputAmount)

        if (stakingModule === 'deposit') {
          previewAction('deposit', inputAmount)
        } else {
          previewAction('withdraw', inputAmount)
        }
      }

      if (inputAmount === 0) {
        setPreviewReset()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [
    lendApi,
    estimateGasDepositApprove,
    chainId,
    curve,
    inputAmount,
    stakingModule,
    previewAction,
    setPreviewReset,
    estimateGasDeposit,
  ])

  return (
    <Wrapper className={className}>
      <SubNav activeKey={stakingModule} navItems={SUB_NAV_ITEMS} setNavChange={setNavChange} />
      <ModuleContainer>
        {stakingModule === 'deposit' ? <DepositModule /> : <WithdrawModule />}
        <StyledDeployButton />
      </ModuleContainer>
      <TransactionDetailsWrapper>
        <TransactionDetails />
      </TransactionDetailsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ModuleContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--box--secondary--background-color);
  max-width: 27.5rem;
  padding: var(--spacing-3);
`

const TransactionDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 27.5rem;
  padding: var(--spacing-3);
  background-color: var(--page--background-color);
`

const StyledDeployButton = styled(DeployButton)`
  margin: var(--spacing-3) 0 0;
`

export default DepositWithdraw
