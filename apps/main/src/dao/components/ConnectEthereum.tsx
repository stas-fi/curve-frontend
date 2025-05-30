import { useRouter } from 'next/navigation'
import { getPath, getRestFullPathname } from '@/dao/utils/utilsRouter'
import Button from '@ui/Button'
import { useConnection } from '@ui-kit/features/connect-wallet'
import { t } from '@ui-kit/lib/i18n'
import type { CurveApi } from '../types/dao.types'

export const ConnectEthereum = () => {
  const { connectState } = useConnection<CurveApi>()
  const { push } = useRouter()
  return (
    <Button
      variant="filled"
      onClick={() => push(getPath({ network: 'ethereum' }, `/${getRestFullPathname()}`))}
      loading={connectState.status === 'loading'}
    >{t`Connect to Ethereum`}</Button>
  )
}
