import { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolRow } from '@/dex/components/PagePoolList/components/PoolRow'
import TableHead from '@/dex/components/PagePoolList/components/TableHead'
import TableHeadMobile from '@/dex/components/PagePoolList/components/TableHeadMobile'
import TableRowNoResult from '@/dex/components/PagePoolList/components/TableRowNoResult'
import TableSettings from '@/dex/components/PagePoolList/components/TableSettings/TableSettings'
import type { ColumnKeys, PagePoolList, SearchParams } from '@/dex/components/PagePoolList/types'
import { COLUMN_KEYS } from '@/dex/components/PagePoolList/utils'
import useCampaignRewardsMapper from '@/dex/hooks/useCampaignRewardsMapper'
import { DEFAULT_FORM_STATUS, getPoolListActiveKey } from '@/dex/store/createPoolListSlice'
import { getUserActiveKey } from '@/dex/store/createUserSlice'
import useStore from '@/dex/store/useStore'
import Spinner, { SpinnerWrapper } from '@ui/Spinner'
import Table, { Tbody } from '@ui/Table'
import { useLayoutStore } from '@ui-kit/features/layout'
import { useUserProfileStore } from '@ui-kit/features/user-profile'
import usePageVisibleInterval from '@ui-kit/hooks/usePageVisibleInterval'
import { REFRESH_INTERVAL } from '@ui-kit/lib/model'

const PoolList = ({
  rChainId,
  curve,
  isLite,
  searchParams,
  searchTermMapper,
  tableLabels,
  updatePath,
}: PagePoolList) => {
  const campaignRewardsMapper = useCampaignRewardsMapper()
  const activeKey = getPoolListActiveKey(rChainId, searchParams)
  const prevActiveKey = useStore((state) => state.poolList.activeKey)
  const formStatus = useStore((state) => state.poolList.formStatus[activeKey] ?? DEFAULT_FORM_STATUS)
  const isMdUp = useLayoutStore((state) => state.isMdUp)
  const isXSmDown = useLayoutStore((state) => state.isXSmDown)
  const isPageVisible = useLayoutStore((state) => state.isPageVisible)
  const poolDataMapperCached = useStore((state) => state.storeCache.poolsMapper[rChainId])
  const poolDataMapper = useStore((state) => state.pools.poolsMapper[rChainId])
  const results = useStore((state) => state.poolList.result)
  const rewardsApyMapper = useStore((state) => state.pools.rewardsApyMapper[rChainId])
  const showHideSmallPools = useStore((state) => state.poolList.showHideSmallPools)
  const tvlMapperCached = useStore((state) => state.storeCache.tvlMapper[rChainId])
  const tvlMapper = useStore((state) => state.pools.tvlMapper[rChainId])
  const userActiveKey = getUserActiveKey(curve)
  const userPoolList = useStore((state) => state.user.poolList[userActiveKey])
  const volumeMapperCached = useStore((state) => state.storeCache.volumeMapper[rChainId])
  const volumeMapper = useStore((state) => state.pools.volumeMapper[rChainId])
  const fetchPoolsRewardsApy = useStore((state) => state.pools.fetchPoolsRewardsApy)
  const setFormValues = useStore((state) => state.poolList.setFormValues)
  const { initCampaignRewards, initiated } = useStore((state) => state.campaigns)
  const hideSmallPools = useUserProfileStore((state) => state.hideSmallPools)
  const isCrvRewardsEnabled = useStore((state) => state.networks.networks[rChainId]?.isCrvRewardsEnabled)

  const [showDetail, setShowDetail] = useState('')

  const result = useMemo(
    () =>
      (results[activeKey] ?? activeKey.split('-')[0] === prevActiveKey.split('-')[0])
        ? results[prevActiveKey]
        : undefined,
    [activeKey, prevActiveKey, results],
  )

  const { chainId, signerAddress = '' } = curve ?? {}
  const showInPoolColumn = !!signerAddress

  const poolDatas = useMemo(() => Object.values(poolDataMapper ?? {}), [poolDataMapper])
  const poolDatasCached = useMemo(() => Object.values(poolDataMapperCached ?? {}), [poolDataMapperCached])

  const isReady = useMemo(() => {
    // volume
    const haveVolumeMapper = typeof volumeMapper !== 'undefined' && Object.keys(volumeMapper).length >= 0
    const volumeCacheOrApi = volumeMapper || volumeMapperCached || {}
    const haveVolume = haveVolumeMapper || Object.keys(volumeCacheOrApi).length > 0

    // tvl
    const haveTvlMapper = typeof tvlMapper !== 'undefined' && Object.keys(tvlMapper).length >= 0
    const tvlCacheOrApi = tvlMapper || tvlMapperCached || {}
    const haveTvl = haveTvlMapper || Object.keys(tvlCacheOrApi).length > 0

    return isLite ? haveTvl : haveVolume && haveTvl
  }, [isLite, tvlMapper, tvlMapperCached, volumeMapper, volumeMapperCached])

  const isReadyWithApiData = useMemo(() => {
    const haveVolume = typeof volumeMapper !== 'undefined' && Object.keys(volumeMapper).length >= 0
    const haveTvl = typeof tvlMapper !== 'undefined' && Object.keys(tvlMapper).length >= 0

    return isLite ? haveTvl : haveVolume && haveTvl
  }, [isLite, tvlMapper, volumeMapper])

  const columnKeys = useMemo(() => {
    const keys: ColumnKeys[] = []
    if (showInPoolColumn) keys.push(COLUMN_KEYS.inPool)
    keys.push(COLUMN_KEYS.poolName)

    if (isLite) {
      return keys.concat([COLUMN_KEYS.rewardsLite, COLUMN_KEYS.tvl])
    }

    isMdUp ? keys.push(COLUMN_KEYS.rewardsDesktop) : keys.push(COLUMN_KEYS.rewardsMobile)
    return keys.concat([COLUMN_KEYS.volume, COLUMN_KEYS.tvl])
  }, [isLite, isMdUp, showInPoolColumn])

  const updateFormValues = useCallback(
    (searchParams: SearchParams) => {
      setFormValues(
        rChainId,
        isLite,
        searchParams,
        hideSmallPools,
        typeof poolDataMapper !== 'undefined' ? poolDatas : undefined,
        poolDatasCached,
        rewardsApyMapper ?? {},
        volumeMapper ?? {},
        volumeMapperCached ?? {},
        tvlMapper ?? {},
        tvlMapperCached ?? {},
        userPoolList ?? {},
        campaignRewardsMapper,
      )
    },
    [
      setFormValues,
      rChainId,
      isLite,
      hideSmallPools,
      poolDataMapper,
      poolDatas,
      poolDatasCached,
      rewardsApyMapper,
      volumeMapper,
      volumeMapperCached,
      tvlMapper,
      tvlMapperCached,
      userPoolList,
      campaignRewardsMapper,
    ],
  )

  usePageVisibleInterval(
    useCallback(() => {
      if (curve && rewardsApyMapper && Object.keys(rewardsApyMapper).length > 0) {
        void fetchPoolsRewardsApy(rChainId, poolDatas)
      }
    }, [curve, fetchPoolsRewardsApy, poolDatas, rChainId, rewardsApyMapper]),
    REFRESH_INTERVAL['11m'],
    isPageVisible,
  )

  // init
  useEffect(() => {
    if ((!isReady && !isReadyWithApiData) || !searchParams) return

    updateFormValues(searchParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isReadyWithApiData, chainId, signerAddress, searchParams, hideSmallPools])

  // init campaignRewardsMapper
  useEffect(() => {
    if (!initiated) {
      initCampaignRewards(rChainId)
    }
  }, [initCampaignRewards, rChainId, initiated])

  let colSpan = isMdUp ? 7 : 4
  if (showHideSmallPools) {
    colSpan++
  }

  return (
    <>
      <TableSettings
        isReady={isReady}
        activeKey={activeKey}
        rChainId={rChainId}
        isLite={isLite}
        poolDatasCachedOrApi={poolDatas ?? poolDatasCached}
        result={result}
        signerAddress={signerAddress}
        searchParams={searchParams}
        tableLabels={tableLabels}
        updatePath={updatePath}
      />

      <Table cellPadding={0} cellSpacing={0}>
        {isXSmDown ? (
          <TableHeadMobile showInPoolColumn={showInPoolColumn} />
        ) : (
          <TableHead
            columnKeys={columnKeys}
            isLite={isLite}
            isReadyRewardsApy={!!rewardsApyMapper}
            isReadyTvl={!!tvlMapper}
            isReadyVolume={!!volumeMapper}
            searchParams={searchParams}
            tableLabels={tableLabels}
            updatePath={updatePath}
          />
        )}
        <Tbody $borderBottom>
          {isReadyWithApiData && formStatus.noResult ? (
            <TableRowNoResult
              colSpan={colSpan}
              searchParams={searchParams}
              signerAddress={signerAddress}
              updatePath={updatePath}
            />
          ) : isReady && Array.isArray(result) ? (
            <>
              {result.map((poolId: string, index: number) => (
                <PoolRow
                  key={poolId}
                  index={index}
                  columnKeys={columnKeys}
                  isCrvRewardsEnabled={isCrvRewardsEnabled}
                  poolId={poolId}
                  rChainId={rChainId}
                  searchParams={searchParams}
                  showInPoolColumn={showInPoolColumn}
                  tableLabels={tableLabels}
                  searchTermMapper={searchTermMapper}
                  showDetail={showDetail}
                  setShowDetail={setShowDetail}
                  curve={curve}
                />
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={colSpan}>
                <SpinnerWrapper>
                  <Spinner />
                </SpinnerWrapper>
              </td>
            </tr>
          )}
        </Tbody>
      </Table>
    </>
  )
}

export default PoolList
