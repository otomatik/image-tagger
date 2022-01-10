import React from 'react'
import { render, screen } from '@testing-library/react'

import ImgImporter from '.'
import userEvent from '@testing-library/user-event'

export class FileReaderMock {
  DONE = FileReader.DONE
  EMPTY = FileReader.EMPTY
  LOADING = FileReader.LOADING
  readyState = 0
  error: FileReader['error'] = null
  result: FileReader['result'] = null
  abort = jest.fn()
  addEventListener = jest.fn()
  dispatchEvent = jest.fn()
  onabort = jest.fn()
  onerror = jest.fn()
  onload = jest.fn()
  onloadend = jest.fn()
  onloadprogress = jest.fn()
  onloadstart = jest.fn()
  onprogress = jest.fn()
  readAsArrayBuffer = jest.fn()
  readAsBinaryString = jest.fn()
  readAsDataURL = jest.fn()
  readAsText = jest.fn()
  removeEventListener = jest.fn()
}

describe('<ImgImporter />', () => {
  const image = 'fake image'
  const fileReader = new FileReaderMock()
  jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should import a file with tags as json', () => {
    const tags = [
      {
        zone: { top: 1, left: 1, width: 100, height: 100 },
        description: 'desc'
      }
    ]

    const fakeContent = JSON.stringify({ image, tags })
    fileReader.result = fakeContent
    fileReader.addEventListener.mockImplementation((_, fn) => fn())

    const callback = jest.fn()

    render(<ImgImporter dataImported={callback} />)

    const input = screen.getByTestId('import-json-input')

    userEvent.upload(input, [
      new File([fakeContent], 'image.json', { type: 'application/json' })
    ])

    expect(callback).toHaveBeenCalledWith(image, tags)
  })

  it('should update the image when the file is loaded', () => {
    const fakeContent = 'file content'

    fileReader.result = fakeContent
    fileReader.addEventListener.mockImplementation((_, fn) => fn())
    const callback = jest.fn()

    render(<ImgImporter dataImported={callback} />)

    const input = screen.getByTestId('import-image-input')

    userEvent.upload(input, [
      new File([fakeContent], 'hello.png', { type: 'image/png' })
    ])

    expect(callback).toHaveBeenCalledWith(fakeContent, [])
  })
})
