import { PROPOSAL_FILTERS, PROPOSAL_SORTING_METHODS } from './constants'

import styled from 'styled-components'
import { t } from '@lingui/macro'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { breakpoints } from '@/ui/utils'

import useStore from '@/store/useStore'

import ProposalsFilters from './components/ProposalsFilters'
import Proposal from './Proposal'
import Box from '@/ui/Box'
import SearchInput from '@/ui/SearchInput'
import Spinner, { SpinnerWrapper } from '@/ui/Spinner'
import SelectSortingMethod from '@/ui/Select/SelectSortingMethod'
import TableButtonFiltersMobile from '@/ui/TableButtonFiltersMobile'
import Icon from '@/ui/Icon'

const Proposals = () => {
  const {
    proposalsLoadingState,
    filteringProposalsLoading,
    activeSortBy,
    activeSortDirection,
    setActiveSortBy,
    setActiveSortDirection,
    setActiveFilter,
    setSearchValue,
    searchValue,
    activeFilter,
    setProposals,
    proposals,
  } = useStore((state) => state.proposals)
  const isSmUp = useStore((state) => state.isSmUp)
  const isLoadingCurve = useStore((state) => state.isLoadingCurve)
  const navigate = useNavigate()

  const handleSortingMethodChange = useCallback(
    (key: React.Key) => {
      setActiveSortBy(key as SortByFilterProposals)
    },
    [setActiveSortBy]
  )

  const handleChangeSortingDirection = useCallback(() => {
    setActiveSortDirection(activeSortDirection === 'asc' ? 'desc' : 'asc')
  }, [activeSortDirection, setActiveSortDirection])

  const handleProposalClick = useCallback(
    (rProposalId: string) => {
      navigate(`/ethereum/proposals/${rProposalId}`)
    },
    [navigate]
  )

  useEffect(() => {
    if (!isLoadingCurve && proposalsLoadingState === 'SUCCESS') {
      setProposals(searchValue)
    }
  }, [
    activeFilter,
    activeSortBy,
    activeSortDirection,
    searchValue,
    setProposals,
    isLoadingCurve,
    proposalsLoadingState,
  ])

  return (
    <Wrapper>
      <PageTitle>Proposals</PageTitle>
      <ProposalsContainer variant="secondary">
        <SortingBox>
          <StyledSearchInput
            id="inpSearchProposals"
            placeholder={t`Search`}
            variant="small"
            handleInputChange={(val) => setSearchValue(val)}
            handleSearchClose={() => setSearchValue('')}
            value={searchValue}
          />
          <ListManagerContainer>
            {!isSmUp ? (
              <TableButtonFiltersMobile
                filters={PROPOSAL_FILTERS}
                filterKey={activeFilter}
                updateRouteFilterKey={setActiveFilter}
              />
            ) : (
              <ProposalsFilters
                filters={PROPOSAL_FILTERS}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                listLength={proposals.length}
              />
            )}
          </ListManagerContainer>
          <SortingMethodContainer>
            <StyledSelectSortingMethod
              selectedKey={activeSortBy}
              minWidth="9rem"
              items={PROPOSAL_SORTING_METHODS}
              onSelectionChange={handleSortingMethodChange}
            />
            <ToggleDirectionIcon
              size={20}
              name={activeSortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              onClick={() => handleChangeSortingDirection()}
            />
          </SortingMethodContainer>
        </SortingBox>
        <Box flex flexColumn>
          {searchValue !== '' && (
            <SearchMessage>
              Showing results ({proposals.length}) for &quot;<strong>{searchValue}</strong>&quot;:
            </SearchMessage>
          )}
          <ProposalsWrapper>
            {proposalsLoadingState === 'LOADING' || filteringProposalsLoading ? (
              <StyledSpinnerWrapper>
                <Spinner />
              </StyledSpinnerWrapper>
            ) : (
              proposals.map((proposal, index) => (
                <Proposal
                  proposalData={proposal}
                  handleClick={handleProposalClick}
                  key={`${proposal.voteId}-${index}`}
                />
              ))
            )}
          </ProposalsWrapper>
        </Box>
      </ProposalsContainer>
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: var(--spacing-4) auto 0;
  width: 65rem;
  max-width: 100%;
  flex-grow: 1;
  min-height: 100%;
  @media (min-width: 49.6875rem) {
    max-width: 95%;
  }
`

const ProposalsContainer = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  width: 100%;
  max-width: 100vw;
  row-gap: var(--spacing-3);
`

const ProposalsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: var(--spacing-3);
  padding: 0 0 var(--spacing-7);
  @media (min-width: 25rem) {
    padding: 0 var(--spacing-3) var(--spacing-7);
  }
`

const SortingBox = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  padding: var(--spacing-3) var(--spacing-3) 0;
  @media (min-width: 49.6875rem) {
    display: flex;
  }
`

const StyledSearchInput = styled(SearchInput)`
  width: calc(100vw - var(--spacing-3) - var(--spacing-3));
  margin: var(--spacing-2) 0;
  grid-row: 1/2;
  grid-column: 1/3;
  @media (min-width: 28.1875rem) {
    margin: var(--spacing-2) var(--spacing-2) var(--spacing-2) 0;
    width: 15rem;
    grid-row: 1/2;
    grid-column: 1/2;
  }
`

const ListManagerContainer = styled.div`
  display: flex;
  flex-direction: row;
  grid-row: 2/3;
  grid-column: 1/2;
  @media (min-width: 28.1875rem) {
    grid-row: 2/3; // Changed to second row
    grid-column: 1/-1;
    margin: var(--spacing-1) var(--spacing-2) var(--spacing-2) 0;
  }
  @media (min-width: 49.6875rem) {
    margin: auto var(--spacing-2);
  }
`

const SortingMethodContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 0 auto auto;
  grid-row: 2/3;
  grid-column: 2/3;
  @media (min-width: 28.1875rem) {
    grid-row: 1/2; // Changed to second row
    grid-column: 2/3;
  }
`

const PageTitle = styled.h2`
  margin: var(--spacing-2) auto var(--spacing-1) var(--spacing-3);
  background-color: black;
  color: var(--nav--page--color);
  font-size: var(--font-size-5);
  font-weight: bold;
  line-height: 1;
  padding: 0 2px;
`

const StyledSelectSortingMethod = styled(SelectSortingMethod)`
  margin: auto 0;
  grid-column: 1/2;
  grid-row: 2/3;
  @media (min-width: 28.1875rem) {
    grid-column: 1/2;
    grid-row: 1/2;
  }
`

const ToggleDirectionIcon = styled(Icon)`
  margin: auto 0 auto var(--spacing-2);
  &:hover {
    cursor: pointer;
  }
`

const SearchMessage = styled.p`
  font-size: var(--font-size-2);
  margin-left: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  padding: 0 var(--spacing-3);
`

const StyledSpinnerWrapper = styled(SpinnerWrapper)`
  width: 100%;
`

export default Proposals
