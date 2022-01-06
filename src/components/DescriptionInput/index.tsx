import React, { FormEvent } from 'react'
import * as S from './styles'
import { Button } from 'rebass'
import { Input } from '@rebass/forms'

interface Props {
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  disabled: boolean
}

const DescriptionInput = ({
  value,
  disabled,
  onChange,
  onConfirm,
  onCancel
}: Props) => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onConfirm()
  }
  return (
    <S.Form onSubmit={onSubmit}>
      <Input
        type="text"
        value={value}
        placeholder="Enter a tag description"
        disabled={disabled}
        data-testid="description-input"
        onChange={(event) => onChange(event.target.value)}
      />
      <Button
        ml={2}
        sx={{
          ':hover': {
            backgroundColor: 'blue',
            cursor: 'pointer'
          },
          ':disabled': {
            backgroundColor: 'lightblue',
            cursor: 'not-allowed'
          }
        }}
        disabled={disabled}
        data-testid="tag-button"
        type="submit"
      >
        Tag
      </Button>
      <Button
        onClick={onCancel}
        variant="secondary"
        ml={2}
        pr={20}
        sx={{
          ':hover': {
            backgroundColor: 'blue',
            cursor: 'pointer'
          },
          ':disabled': {
            backgroundColor: 'lightblue',
            cursor: 'not-allowed'
          }
        }}
        disabled={disabled}
      >
        Cancel
      </Button>
    </S.Form>
  )
}

export default DescriptionInput
