import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { LlamaMarketColumnId } from '@/loan/components/PageLlamaMarkets/columns.enum'
import { LlamaMarket, LlamaMarketType } from '@/loan/entities/llama-markets'
import PersonIcon from '@mui/icons-material/Person'
import Stack from '@mui/material/Stack'
import { DeepKeys } from '@tanstack/table-core/build/lib/utils'
import { t } from '@ui-kit/lib/i18n'
import { HeartIcon } from '@ui-kit/shared/icons/HeartIcon'
import { PointsIcon } from '@ui-kit/shared/icons/PointsIcon'
import { ResetFiltersButton } from '@ui-kit/shared/ui/DataTable'
import { SelectableChip } from '@ui-kit/shared/ui/SelectableChip'
import { SizesAndSpaces } from '@ui-kit/themes/design/1_sizes_spaces'

const { Spacing } = SizesAndSpaces

type LlamaMarketKey = DeepKeys<LlamaMarket>

type ColumnFilterProps = {
  columnFiltersById: Record<LlamaMarketKey, unknown>
  setColumnFilter: (id: LlamaMarketKey, value: unknown) => void
}

/** Hook for managing a single boolean filter */
function useToggleFilter(key: LlamaMarketKey, { columnFiltersById, setColumnFilter }: ColumnFilterProps) {
  const isSelected = !!columnFiltersById[key]
  const toggle = useCallback(
    () => setColumnFilter(key, isSelected ? undefined : true),
    [isSelected, key, setColumnFilter],
  )
  return [isSelected, toggle] as const
}

/**
 * Hook for managing market type filter
 * @returns marketTypes - object with keys for each market type and boolean values indicating if the type is selected
 * @returns toggles - object with keys for each market type and functions to toggle the type
 */
function useMarketTypeFilter({ columnFiltersById, setColumnFilter }: ColumnFilterProps) {
  const filter = columnFiltersById[LlamaMarketColumnId.Type] as LlamaMarketType[] | undefined
  const toggleMarketType = useCallback(
    (type: LlamaMarketType) => {
      setColumnFilter(
        LlamaMarketColumnId.Type,
        filter?.includes(type) ? filter.filter((f) => f !== type) : [...(filter || []), type],
      )
    },
    [filter, setColumnFilter],
  )

  const marketTypes = {
    [LlamaMarketType.Mint]: filter?.includes(LlamaMarketType.Mint) ?? false,
    [LlamaMarketType.Lend]: filter?.includes(LlamaMarketType.Lend) ?? false,
  }
  const toggles = {
    [LlamaMarketType.Mint]: useCallback(() => toggleMarketType(LlamaMarketType.Mint), [toggleMarketType]),
    [LlamaMarketType.Lend]: useCallback(() => toggleMarketType(LlamaMarketType.Lend), [toggleMarketType]),
  }
  return [marketTypes, toggles] as const
}

type MarketsFilterChipsProps = ColumnFilterProps & {
  resetFilters: () => void
  hasFilters: boolean
  hasPositions: boolean | undefined
  hasFavorites: boolean | undefined
}

export const MarketsFilterChips = ({
  resetFilters,
  hasFilters,
  hasPositions,
  hasFavorites,
  ...props
}: MarketsFilterChipsProps) => {
  const [myMarkets, toggleMyMarkets] = useToggleFilter(LlamaMarketColumnId.UserHasPosition, props)
  const [favorites, toggleFavorites] = useToggleFilter(LlamaMarketColumnId.IsFavorite, props)
  const [rewards, toggleRewards] = useToggleFilter(LlamaMarketColumnId.Rewards, props)
  const [marketTypes, toggleMarkets] = useMarketTypeFilter(props)
  const { address } = useAccount()

  return (
    <Stack direction="row" gap={Spacing.md} flexWrap="wrap" alignItems="center" justifyContent="flex-end">
      <Stack direction="row" columnGap="4px">
        <SelectableChip
          label={t`Mint Markets`}
          selected={marketTypes.Mint}
          toggle={toggleMarkets.Mint}
          data-testid="chip-mint"
        />
        <SelectableChip
          label={t`Lend Markets`}
          selected={marketTypes.Lend}
          toggle={toggleMarkets.Lend}
          data-testid="chip-lend"
        />
      </Stack>
      <Stack direction="row" columnGap="4px">
        {address && (
          <SelectableChip
            label={t`My Markets`}
            selected={myMarkets}
            toggle={toggleMyMarkets}
            icon={<PersonIcon />}
            data-testid="chip-my-markets"
            disabled={!hasPositions}
          />
        )}
        <SelectableChip
          label={t`Favorites`}
          selected={favorites}
          toggle={toggleFavorites}
          icon={<HeartIcon />}
          data-testid="chip-favorites"
          disabled={!hasFavorites}
        />
        <SelectableChip
          label={t`Rewards`}
          selected={rewards}
          toggle={toggleRewards}
          icon={<PointsIcon />}
          data-testid="chip-rewards"
        />
      </Stack>
      <ResetFiltersButton onClick={resetFilters} hidden={!hasFilters} />
    </Stack>
  )
}
