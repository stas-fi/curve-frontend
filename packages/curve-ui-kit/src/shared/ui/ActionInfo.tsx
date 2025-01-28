import { Stack } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import Icon from 'ui/src/Icon'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Duration } from '../../themes/design/0_primitives'
import { shortenTokenAddress } from 'ui/src/utils/'
import { t } from 'i18next'
import { useSwitch } from '../../hooks/useSwitch'
import { SizesAndSpaces } from '../../themes/design/1_sizes_spaces'

const { Spacing } = SizesAndSpaces

type ComponentSize = 'small' | 'medium' | 'large'

type ActionInfoProps = {
  label: string
  address: string
  linkAddress: string
  size?: ComponentSize
}

const labelSize: Record<ComponentSize, 'bodyXsRegular' | 'bodyMRegular'> = {
  small: 'bodyXsRegular',
  medium: 'bodyMRegular',
  large: 'bodyMRegular',
}

const addressSize: Record<ComponentSize, 'bodyXsBold' | 'highlightM' | 'headingSBold'> = {
  small: 'bodyXsBold',
  medium: 'highlightM',
  large: 'headingSBold',
}

const ActionInfo = ({ label, address, linkAddress, size = 'small' }: ActionInfoProps) => {
  const [isOpen, open, close] = useSwitch(false)

  const copyValue = () => {
    navigator.clipboard.writeText(address)
    open()
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant={labelSize[size]} color="textTertiary">
        {label}
      </Typography>
      <Stack direction="row" alignItems="center">
        <Typography variant={addressSize[size]} color="textPrimary" sx={{ marginRight: Spacing.sm }}>
          {shortenTokenAddress(address)}
        </Typography>
        <IconButton size="small" onClick={copyValue} color="primary">
          <Icon name="Copy" size={24} />
        </IconButton>
        <IconButton component={Link} href={linkAddress} target="_blank" rel="noopener" size="small" color="primary">
          <Icon name="ArrowUpRight" size={24} />
        </IconButton>
      </Stack>

      <Snackbar open={isOpen} onClose={close} autoHideDuration={Duration.Snackbar}>
        <Alert variant="filled" severity="success">
          <AlertTitle>{t`Copied to clipboard!`}</AlertTitle>
          {address}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default ActionInfo
