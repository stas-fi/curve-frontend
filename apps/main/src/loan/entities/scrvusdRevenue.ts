import type { Revenue } from '@curvefi/prices-api/savings/models'
import { queryFactory } from '@ui-kit/lib/model/query'
import { createValidationSuite } from '@ui-kit/lib/validation'
import { getRevenue } from '@curvefi/prices-api/savings'
import { weiToEther } from '@ui-kit/utils'

type Epoch = { startDate: Date; endDate: Date; weeklyRevenue: number; data: Revenue[] }

export type ScrvUsdRevenue = { totalDistributed: string; epochs: Epoch[]; history: Revenue[] }

/**
 * Separate the revenue in epochs (to display bars containing up to 7 days each)
 */
const organizeDataIntoEpochs = (history: Revenue[]): Epoch[] => {
  // Sort history by date
  const sortedHistory = [...history].sort((a, b) => a.date.getTime() - b.date.getTime())

  const epochs: Epoch[] = []
  let currentEpoch: Epoch | null = null

  sortedHistory.forEach((item) => {
    // If we don't have a current epoch or the item doesn't belong to current epoch
    if (!currentEpoch || item.date > new Date(currentEpoch.endDate)) {
      // Find the previous Thursday if item is not on Thursday
      const startDate = new Date(item.date)
      while (startDate.getDay() !== 4) {
        // 4 represents Thursday
        startDate.setDate(startDate.getDate() - 1)
      }

      // Set end date to next Thursday
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)

      currentEpoch = { startDate: startDate, endDate: endDate, weeklyRevenue: 0, data: [] }
      epochs.push(currentEpoch)
    }

    currentEpoch.data.push(item)
    // Add to weekly revenue (gain - loss)
    currentEpoch.weeklyRevenue += weiToEther(Number(item.gain) - Number(item.loss))
  })

  return epochs
}

export const _getScrvUsdRevenue = async (): Promise<ScrvUsdRevenue> => {
  const pages = 1
  const dataPerPage = 300

  const data = await getRevenue(pages, dataPerPage)

  const formattedData = { ...data, epochs: organizeDataIntoEpochs(data.history) }

  return formattedData
}

export const { useQuery: useScrvUsdRevenue } = queryFactory({
  queryKey: () => ['scrvUsdRevenue'] as const,
  queryFn: _getScrvUsdRevenue,
  staleTime: '5m',
  validationSuite: createValidationSuite(() => {}),
})
