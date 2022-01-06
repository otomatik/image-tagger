import React from 'react'

import { render, screen } from '@testing-library/react'

jest.mock('file-saver')
import * as saver from 'file-saver'

const mockSaveAs = jest.fn()
const saverMock = (saver as unknown) as jest.Mock
saverMock.mockImplementation(mockSaveAs)

import ImgExporter from '.'

describe('<ImgExporter />', () => {
  it('should export a file with tags as json', () => {
    const image = 'fake image'
    const tags = [
      {
        zone: { top: 1, left: 1, width: 100, height: 100 },
        description: 'desc'
      }
    ]
    const blob = new Blob([JSON.stringify({ image, tags })])

    render(<ImgExporter image={image} tags={tags} disabled={false} />)

    screen.getByRole('button').click()

    // apparently comparison with Blob does not work,
    // see: https://github.com/facebook/jest/issues/7372
    expect(mockSaveAs).toHaveBeenCalledWith(blob, 'image.json')
  })

  it('should disable the button', () => {
    render(<ImgExporter image={'fake image'} tags={[]} disabled={true} />)

    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
  })
})
