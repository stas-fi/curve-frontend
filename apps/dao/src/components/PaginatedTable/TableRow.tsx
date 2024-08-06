import styled from 'styled-components'

import networks from '@/networks'
import { shortenTokenAddress, formatNumber, formatDateFromTimestamp, convertToLocaleTimestamp } from '@/ui/utils'

import { ExternalLink } from '@/ui/Link'

interface TableRowProps {
  holder: any
  sortBy: { key: string; label: string; order: 'asc' | 'desc' }
  labels: { key: string; label: string }[]
  rank: number
  minWidth: number
}

const TableRow: React.FC<TableRowProps> = ({ holder, sortBy, labels, rank, minWidth }) => (
  <TableRowWrapper minWidth={minWidth} columns={labels.length}>
    {labels.map((label, index) => (
      <TableData key={index} className={sortBy.key === label.key ? 'active left-padding' : 'left-padding'}>
        {formatNumber(holder[label.key], { showDecimalIfSmallNumberOnly: true })}
      </TableData>
    ))}
  </TableRowWrapper>
)

export const TableRowWrapper = styled.div<{ minWidth: number; columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  padding: var(--spacing-1) 0;
  border-bottom: 1px solid var(--gray-500a20);
  min-width: ${({ minWidth }) => `${minWidth}rem`};
  &:last-child {
    border-bottom: none;
  }
`

export const TableData = styled.p`
  font-variant-numeric: tabular-nums;
  font-size: var(--font-size-2);
  font-weight: var(--semi-bold);
  line-height: 1.5;
  display: flex;
  gap: var(--spacing-1);
  &.left-padding {
    padding-left: var(--spacing-2);
  }
  &.active {
    font-weight: var(--bold);
  }
`

export default TableRow
