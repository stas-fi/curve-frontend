import { t } from '@ui-kit/lib/i18n'
import React from 'react'
import styled from 'styled-components'

import AlertBox from '@ui/AlertBox'
import Checkbox from '@ui/Checkbox'
import { HealthMode } from '@/loan/types/loan.types'

interface Props extends HealthMode {
  confirmed: boolean
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>
}

function DialogHealthWarning({ confirmed, warningTitle, warning, setConfirmed }: Props) {
  const handleInpChange = (isConfirmed: boolean) => {
    setConfirmed(isConfirmed)
  }

  return (
    <>
      <AlertBox alertType="error">
        {warningTitle}
        <br />
        {warning}
      </AlertBox>

      <StyledCheckbox isSelected={confirmed} onChange={handleInpChange}>
        {t`Confirm warning to proceed.`}
      </StyledCheckbox>
    </>
  )
}

const StyledCheckbox = styled(Checkbox)`
  margin-top: 1rem;
`

export default DialogHealthWarning
