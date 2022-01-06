import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DescriptionInput from '.'

describe('<DescriptionInput />', () => {
  it('should call confirm callback onclick', () => {
    const callbackConfirm = jest.fn()
    const callbackChange = jest.fn()
    const callbackCancel = jest.fn()

    render(
      <DescriptionInput
        value=""
        onConfirm={callbackConfirm}
        onChange={callbackChange}
        onCancel={callbackCancel}
        disabled={false}
      />
    )

    const button = screen.getByTestId('tag-button')

    button.click()

    expect(callbackConfirm).toHaveBeenCalled()
  })

  it('should not call confirm callback onclick when disabled', () => {
    const callbackConfirm = jest.fn()
    const callbackChange = jest.fn()
    const callbackCancel = jest.fn()

    render(
      <DescriptionInput
        value=""
        onConfirm={callbackConfirm}
        onChange={callbackChange}
        onCancel={callbackCancel}
        disabled={true}
      />
    )

    const button = screen.getByTestId('tag-button')

    button.click()

    expect(callbackConfirm).not.toHaveBeenCalled()
  })

  it('should call onChange callback when typing', () => {
    const callbackConfirm = jest.fn()
    const callbackChange = jest.fn()
    const callbackCancel = jest.fn()

    render(
      <DescriptionInput
        value=""
        onConfirm={callbackConfirm}
        onChange={callbackChange}
        onCancel={callbackCancel}
        disabled={false}
      />
    )

    const input = screen.getByTestId('description-input')
    userEvent.type(input, 'desc')

    expect(callbackChange).toHaveBeenCalled()
  })
})
