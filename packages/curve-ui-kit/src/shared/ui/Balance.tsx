import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SizesAndSpaces } from '@ui-kit/themes/design/1_sizes_spaces'
import type { SxProps } from '@ui-kit/utils'

const { Spacing, IconSize } = SizesAndSpaces

const formatNumber = (value?: number): string => {
  if (value == null) return '?'
  if (value === 0) return '0'

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

type MaxButtonProps = {
  children: React.ReactNode
  underline: boolean
  sx?: SxProps
  onClick?: () => void
}

/** Reusable Max button component with consistent styling */
const MaxButton = ({ children, underline, sx, onClick }: MaxButtonProps) => (
  <Button
    variant="inline"
    color="ghost"
    size="extraSmall"
    onClick={onClick}
    sx={{
      /**
       * Remove any properties that cause the total height component to change
       * depending on the value of the 'max' property of BalanceText.
       * Under normal circumstances, we want the ghost link to have a bit of
       * white space and thus breathing room. However in this case we want the
       * link to be embedded into the typography and be as compact as possible.
       */
      ...(underline && {
        '&:hover .balance': {
          textDecoration: 'underline',
        },
      }),
      ...sx,
    }}
  >
    {children}
  </Button>
)

type BalanceTextProps = {
  symbol: string
  balance?: number
}

const BalanceText = ({ symbol, balance }: BalanceTextProps) => (
  <Stack direction="row" gap={Spacing.xs} alignItems="center">
    <Typography className="balance" variant="highlightS" color={balance != null ? 'textPrimary' : 'textTertiary'}>
      {formatNumber(balance)}
    </Typography>

    <Typography variant="highlightS" color="textPrimary">
      {symbol}
    </Typography>
  </Stack>
)

/**
 * Props for the Balance component
 */
export type Props = {
  /** The token symbol to display */
  symbol: string
  /** Controls how the max value is displayed:
   * - 'balance': Shows the balance as a clickable link
   * - 'button': Shows a separate 'Max' button
   * - 'off': No max functionality is shown
   */
  max: 'balance' | 'button' | 'off'
  /** The token balance amount (optional, in case of loading) */
  balance?: number
  /** The USD value of the balance (optional) */
  notionalValue?: number
  /** Whether to hide the wallet icon */
  hideIcon?: boolean
  sx?: SxProps
  /** Callback function when max button/balance is clicked */
  onMax?: (maxValue: number) => void
}

export const Balance = ({ symbol, max, balance, notionalValue, hideIcon, sx, onMax }: Props) => (
  <Stack direction="row" gap={Spacing.xs} alignItems="center" sx={sx}>
    {!hideIcon && <AccountBalanceWalletOutlinedIcon sx={{ width: IconSize.sm, height: IconSize.sm }} />}

    {max === 'balance' && balance != null ? (
      <MaxButton underline={true} onClick={() => onMax?.(balance)}>
        <BalanceText symbol={symbol} balance={balance} />
      </MaxButton>
    ) : (
      <BalanceText symbol={symbol} balance={balance} />
    )}

    {notionalValue && (
      <Typography variant="bodySRegular" color="textTertiary">
        ${formatNumber(notionalValue)}
      </Typography>
    )}

    {max === 'button' && balance != null && (
      <MaxButton
        underline={false}
        onClick={() => onMax?.(balance)}
        // Right-align without flex grow for precise click area
        sx={{ marginLeft: 'auto' }}
      >
        Max
      </MaxButton>
    )}
  </Stack>
)
