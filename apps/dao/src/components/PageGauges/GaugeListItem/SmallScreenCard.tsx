import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useState, useEffect } from 'react'

import networks from '@/networks'
import useStore from '@/store/useStore'

import IconButton from '@/ui/IconButton'
import Spinner, { SpinnerWrapper } from '@/ui/Spinner'
import Icon from '@/ui/Icon'
import Box from '@/ui/Box'
import ErrorMessage from '@/components/ErrorMessage'
import InternalLinkButton from '@/components/InternalLinkButton'

import LineChartComponent from '@/components/Charts/LineChartComponent'
import TitleComp from './TitleComp'
import VoteGaugeField from '../GaugeVoting/VoteGaugeField'
import GaugeDetailsSm from './GaugeDetailsSm'

type Props = {
  gaugeData: GaugeFormattedData
  userGaugeWeightVoteData?: UserGaugeVoteWeight
  powerUsed?: number
  userGaugeVote?: boolean
  addUserVote?: boolean
}

const SmallScreenCard: React.FC<Props> = ({
  gaugeData,
  userGaugeWeightVoteData,
  powerUsed,
  userGaugeVote = false,
  addUserVote = false,
}) => {
  const { gaugeWeightHistoryMapper, getHistoricGaugeWeights, gaugeListSortBy } = useStore((state) => state.gauges)
  const { veCrv } = useStore((state) => state.user.userVeCrv)
  const [open, setOpen] = useState(false)

  const imageBaseUrl = networks[1].imageBaseUrl
  const gaugeHistoryLoading =
    gaugeWeightHistoryMapper[gaugeData.address]?.loadingState === 'LOADING' ||
    !gaugeWeightHistoryMapper[gaugeData.address] ||
    (gaugeWeightHistoryMapper[gaugeData.address]?.data.length === 0 &&
      gaugeWeightHistoryMapper[gaugeData.address]?.loadingState !== 'ERROR')

  useEffect(() => {
    if (open && !gaugeWeightHistoryMapper[gaugeData.address]) {
      getHistoricGaugeWeights(gaugeData.address)
    }
  }, [gaugeData.address, gaugeWeightHistoryMapper, getHistoricGaugeWeights, open])

  const getGaugeListSortingData = (key: string) => {
    if (key === 'gauge_relative_weight') {
      return { title: t`Weight`, value: `${gaugeData.gauge_relative_weight.toFixed(2)}%` }
    }
    if (key === 'gauge_relative_weight_7d_delta') {
      return {
        title: t`7d Delta`,
        value: gaugeData.gauge_relative_weight_7d_delta
          ? `${gaugeData.gauge_relative_weight_7d_delta?.toFixed(2)}%`
          : 'N/A',
      }
    }
    return {
      title: t`60d Delta`,
      value: gaugeData.gauge_relative_weight_60d_delta
        ? `${gaugeData.gauge_relative_weight_60d_delta?.toFixed(2)}%`
        : 'N/A',
    }
  }

  const gaugeListSortedData = getGaugeListSortingData(gaugeListSortBy.key)

  return (
    <GaugeBox onClick={() => setOpen(!open)} addUserVote={addUserVote}>
      <Box flex flexGap="var(--spacing-2)">
        <StyledTitleComp gaugeData={gaugeData} imageBaseUrl={imageBaseUrl} />
        {userGaugeWeightVoteData ? (
          <Box flex flexColumn flexGap="var(--spacing-2)" margin="auto 0 auto auto">
            <GaugeDataTitle>{t`Weight`}</GaugeDataTitle>
            <GaugeData>{userGaugeWeightVoteData.userPower}%</GaugeData>
          </Box>
        ) : (
          <Box flex flexColumn flexGap="var(--spacing-2)" margin="auto 0 auto auto">
            <GaugeDataTitle>{gaugeListSortedData.title}</GaugeDataTitle>
            <GaugeData>{gaugeListSortedData.value}</GaugeData>
          </Box>
        )}
        <StyledIconButton size="small">
          {open ? <Icon name="ChevronUp" size={16} /> : <Icon name="ChevronDown" size={16} />}
        </StyledIconButton>
      </Box>
      {open && (
        <OpenContainer
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation()
          }}
        >
          <ChartWrapper>
            {userGaugeVote && powerUsed && userGaugeWeightVoteData && (
              <VoteGaugeFieldWrapper>
                <VoteGaugeField powerUsed={powerUsed} userVeCrv={+veCrv} userGaugeVoteData={userGaugeWeightVoteData} />
              </VoteGaugeFieldWrapper>
            )}
            {gaugeWeightHistoryMapper[gaugeData.address]?.loadingState === 'ERROR' && (
              <ErrorWrapper onClick={(e) => e.stopPropagation()}>
                <ErrorMessage
                  message={t`Error fetching historical gauge weights data`}
                  onClick={(e?: React.MouseEvent) => {
                    e?.stopPropagation()
                    getHistoricGaugeWeights(gaugeData.address)
                  }}
                />
              </ErrorWrapper>
            )}
            {gaugeHistoryLoading && (
              <StyledSpinnerWrapper>
                <Spinner size={16} />
              </StyledSpinnerWrapper>
            )}
            {gaugeWeightHistoryMapper[gaugeData.address]?.data.length !== 0 &&
              gaugeWeightHistoryMapper[gaugeData.address]?.loadingState === 'SUCCESS' && (
                <LineChartComponent height={400} data={gaugeWeightHistoryMapper[gaugeData.address]?.data} />
              )}
          </ChartWrapper>
          <GaugeDetailsSm gaugeData={gaugeData} userGaugeWeightVoteData={userGaugeWeightVoteData} />
          <Box flex flexGap={'var(--spacing-3)'} flexAlignItems={'center'} margin={'var(--spacing-2) auto'}>
            <InternalLinkButton to={`/gauges/${gaugeData.address}`}>{t`VISIT GAUGE`}</InternalLinkButton>
          </Box>
        </OpenContainer>
      )}
    </GaugeBox>
  )
}

const GaugeBox = styled.div<{ addUserVote: boolean }>`
  display: grid;
  padding: calc(var(--spacing-2) + var(--spacing-1)) var(--spacing-3) calc(var(--spacing-2) + var(--spacing-1));
  gap: var(--spacing-1);
  border-bottom: 1px solid var(--gray-500a20);
  ${({ addUserVote }) => addUserVote && 'border: 1px solid inherit;'}
  &:hover {
    cursor: pointer;
  }
`

const StyledTitleComp = styled(TitleComp)`
  margin-right: auto;
`

const DataComp = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const GaugeDataTitle = styled.p`
  font-size: var(--font-size-1);
  text-align: right;
  opacity: 0.7;
`

const GaugeData = styled.p`
  font-size: var(--font-size-2);
  font-weight: var(--bold);
  text-align: right;
`

const StyledIconButton = styled(IconButton)`
  margin-left: var(--spacing-2);
`

const OpenContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-3) var(--spacing-1) 0;
  gap: var(--spacing-2);
`

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
  @media (min-width: 45.625rem) {
    flex-direction: row;
  }
`

const VoteGaugeFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  @media (min-width: 45.625rem) {
    width: 50%;
  }
`

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
`

const StyledSpinnerWrapper = styled(SpinnerWrapper)`
  height: 400px;
`

export default SmallScreenCard