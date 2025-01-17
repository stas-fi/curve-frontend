import { t } from '@lingui/macro'

import { formatNumber } from '@ui/utils'

import DetailInfo from '@ui/DetailInfo'

type Props = {
  isReady: boolean
  n: number | null
}

const DetailInfoN = ({ isReady, n }: Props) => (
  <DetailInfo label={t`N:`}>{isReady && <strong>{formatNumber(n, { defaultValue: '-' })}</strong>}</DetailInfo>
)

export default DetailInfoN
