import isNaN from 'lodash/isNaN'
import isUndefined from 'lodash/isUndefined'
import { useMemo } from 'react'
import AlertFormError from '@/dex/components/AlertFormError'
import AlertSlippage from '@/dex/components/AlertSlippage'
import type { FormStatus, FormValues, SearchedParams } from '@/dex/components/PageRouterSwap/types'
import useStore from '@/dex/store/useStore'
import AlertBox from '@ui/AlertBox'
import { t } from '@ui-kit/lib/i18n'

const RouterSwapAlerts = ({
  formStatus,
  formValues,
  maxSlippage,
  toAmountOutput,
  isExchangeRateLow,
  isHighImpact,
  isExpectedToAmount,
  searchedParams,
  updateFormValues,
}: {
  formStatus: FormStatus
  formValues: FormValues
  maxSlippage: string
  toAmountOutput: string
  isExchangeRateLow: boolean
  isHighImpact?: boolean
  isExpectedToAmount?: boolean
  searchedParams: SearchedParams
  updateFormValues: (
    updatedFormValues: Partial<FormValues>,
    isGetMaxFrom?: boolean,
    maxSlippage?: string,
    isFullReset?: boolean,
  ) => void
}) => {
  const usdRatesMapper = useStore((state) => state.usdRates.usdRatesMapper)

  const { error, swapError } = formStatus
  const { toAddress } = searchedParams

  const toUsdRate = usdRatesMapper[toAddress]

  const usdToAmount = useMemo(
    () =>
      !isUndefined(toUsdRate) && !isNaN(toUsdRate) ? (Number(formValues.toAmount) * Number(toUsdRate)).toString() : '',
    [formValues.toAmount, toUsdRate],
  )

  return (
    <>
      {isHighImpact && <AlertBox alertType="error">{t`Warning! High price impact!`}</AlertBox>}
      {isExchangeRateLow && <AlertBox alertType="error">{t`Warning! Exchange rate is too low!`}</AlertBox>}
      {isExpectedToAmount && (
        <AlertBox alertType="warning">{t`The expected amount you would like to receive, ${formValues.toAmount}, will actually be ${toAmountOutput}.`}</AlertBox>
      )}

      <AlertSlippage maxSlippage={maxSlippage} usdAmount={usdToAmount} />

      <AlertFormError errorKey={swapError || error} handleBtnClose={() => updateFormValues({})} />
    </>
  )
}

export default RouterSwapAlerts
