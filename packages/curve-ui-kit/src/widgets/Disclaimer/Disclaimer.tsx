import { useState } from 'react'
import { t } from '@lingui/macro'

import Stack from '@mui/material/Stack'

import { TabsSwitcher } from 'curve-ui-kit/src/shared/ui/TabsSwitcher'
import { SizesAndSpaces } from 'curve-ui-kit/src/themes/design/1_sizes_spaces'

import { LastUpdated } from './LastUpdated'
import { Footer } from './Footer'
import { TabPanel } from './TabPanel'
import { Dex } from './Tabs/Dex'
import { LlamaLend } from './Tabs/LlamaLend'
import { CrvUsd } from './Tabs/CrvUsd'
import { SCrvUsd } from './Tabs/SCrvUsd'

const { MaxWidth } = SizesAndSpaces

const DEFAULT_TAB_INDEX = 0
const tabs = [
  { id: 'dex', label: t`Dex` },
  { id: 'lend', label: t`LlamaLend` },
  { id: 'crvusd', label: t`crvUSD` },
  { id: 'scrvusd', label: t`Savings crvUSD` },
].map((tab, value) => ({
  ...tab,
  value,
}))

type Props = {
  className?: string
}

export const Disclaimer = ({ className }: Props) => {
  // Tried using NextJS router to get the query but not sure if it works with a hash (#) URL.
  const getTabFromUrl = () => {
    if (typeof window === 'undefined') return DEFAULT_TAB_INDEX
    const params = new URLSearchParams(window.location.hash.split('?')[1])
    const tabId = params.get('tab')
    return tabs.find((tab) => tab.id === tabId)?.value ?? DEFAULT_TAB_INDEX
  }

  const handleTabChange = (newTabIndex: number) => {
    setTabIndex(newTabIndex)
    const tabId = tabs.find((tab) => tab.value === newTabIndex)?.id
    const currentHash = window.location.hash.split('?')[0]
    window.location.hash = `${currentHash}?tab=${tabId}`
  }

  const [tabIndex, setTabIndex] = useState(getTabFromUrl())

  return (
    <Stack
      className={className}
      sx={{
        width: MaxWidth.sm,
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <TabsSwitcher variant="contained" value={tabIndex} onChange={handleTabChange} options={tabs} />
        <LastUpdated />
      </Stack>

      <TabPanel>
        {tabIndex === 0 && <Dex />}
        {tabIndex === 1 && <LlamaLend />}
        {tabIndex === 2 && <CrvUsd />}
        {tabIndex === 3 && <SCrvUsd />}
        <Footer />
      </TabPanel>
    </Stack>
  )
}
