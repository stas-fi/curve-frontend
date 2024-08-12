import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useMemo } from 'react'

import useStore from '@/store/useStore'

import BarChartComponent from '../../Charts/BarChartComponent'
import Spinner, { SpinnerWrapper } from '@/ui/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import Box from '@/ui/Box'

const GaugeWeightDistribution = () => {
  const { getGauges, gaugesLoading, gaugeMapper } = useStore((state) => state.gauges)

  const formattedData = useMemo(() => {
    return Object.values(gaugeMapper)
      .filter((gauge) => gauge.gauge_relative_weight > 0.5)
      .sort((a, b) => b.gauge_relative_weight - a.gauge_relative_weight)
  }, [gaugeMapper])

  return (
    <Box flex flexColumn padding={'0 var(--spacing-3)'} variant="secondary">
      <Box flex flexColumn padding={'var(--spacing-3) 0 0'}>
        <ChartToolBar>
          <ChartTitle>{t`Gauges Relative Weight Distribution`}</ChartTitle>
          <ChartDescription>{t`Showing gauges with >0.5% relative gauge weight`}</ChartDescription>
        </ChartToolBar>
        {gaugesLoading === 'LOADING' && (
          <StyledSpinnerWrapper>
            <Spinner size={24} />
          </StyledSpinnerWrapper>
        )}
        {gaugesLoading === 'ERROR' && (
          <ErrorMessageWrapper>
            <ErrorMessage message={t`Error fetching gauges`} onClick={() => getGauges(true)} />
          </ErrorMessageWrapper>
        )}
        {gaugesLoading === 'SUCCESS' && <BarChartComponent data={formattedData} />}
      </Box>
    </Box>
  )
}

const StyledSpinnerWrapper = styled(SpinnerWrapper)`
  width: 100%;
  min-width: 100%;
`

const ChartToolBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin: 0 0 var(--spacing-2);
`

const ChartTitle = styled.h4`
  font-size: var(--font-size-2);
  font-weight: var(--bold);
`

const ChartDescription = styled.p`
  font-size: var(--font-size-1);
`

const ErrorMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: 100%;
  padding: var(--spacing-4);
  margin-bottom: var(--spacing-3);
`

export default GaugeWeightDistribution
