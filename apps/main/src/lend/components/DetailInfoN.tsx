import { t } from '@ui-kit/lib/i18n'

import { formatNumber } from '@ui/utils'

import DetailInfo from '@ui/DetailInfo'

type Props = {
  isLoaded: boolean
  n: number | null
}

const DetailInfoN = ({ isLoaded, n }: Props) => (
  <DetailInfo label={t`N:`}>{isLoaded && <strong>{formatNumber(n, { defaultValue: '-' })}</strong>}</DetailInfo>
)

export default DetailInfoN
