import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import { t } from '@lingui/macro'
import React from 'react'
import { SizesAndSpaces } from '@ui-kit/themes/design/1_sizes_spaces'
import { LlamaMarket, LlamaMarketType } from '@/loan/entities/llama-markets'
import IconButton from '@mui/material/IconButton'
import { FavoriteHeartIcon } from '@ui-kit/shared/icons/HeartIcon'
import { PointsIcon } from '@ui-kit/shared/icons/PointsIcon'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { DesktopOnlyHoverClass } from '@ui-kit/shared/ui/DataTable'
import { useFavoriteMarket } from '@/loan/entities/favorite-markets'
import { PoolRewards } from '@/loan/entities/campaigns'

const { Spacing } = SizesAndSpaces

const poolTypeNames: Record<LlamaMarketType, () => string> = {
  [LlamaMarketType.Pool]: () => t`Pool`,
  [LlamaMarketType.Mint]: () => t`Mint`,
}

const getRewardsDescription = ({ action, description, multiplier }: PoolRewards) =>
  `${multiplier}x: ${
    {
      lp: description ?? t`Earn points by providing liquidity.`,
      supply: t`Earn points by supplying liquidity.`,
      borrow: t`Earn points by borrowing.`,
    }[action]
  }`

/** Displays badges for a pool, such as the chain icon and the pool type. */
export const MarketBadges = ({ market: { address, rewards, type, leverage } }: { market: LlamaMarket }) => {
  const [isFavorite, toggleFavorite] = useFavoriteMarket(address)
  const iconsColor = useTheme().design.Text.TextColors.Highlight
  return (
    <Stack direction="row" gap={Spacing.sm} alignItems="center">
      <Chip size="small" color="default" label={poolTypeNames[type]()} />
      {leverage > 0 && (
        <Tooltip title={t`How much you can leverage your position`}>
          <Chip size="small" color="highlight" label={t`🔥 ${leverage.toPrecision(2)}x leverage`} />
        </Tooltip>
      )}

      {rewards && (
        <Tooltip title={getRewardsDescription(rewards)} placement="top">
          <PointsIcon htmlColor={iconsColor} />
        </Tooltip>
      )}

      <IconButton size="extraSmall" onClick={toggleFavorite} className={isFavorite ? '' : DesktopOnlyHoverClass}>
        <FavoriteHeartIcon color={iconsColor} isFavorite={isFavorite} />
      </IconButton>
    </Stack>
  )
}
