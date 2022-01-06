import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ImgTagger from '.'

describe('<ImgTagger />', () => {
  it('should create a tag zone when clicking on the image', () => {
    const callback = jest.fn()

    render(<ImgTagger tags={[]} image="fake image" updateTags={callback} />)

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()

    // create a tag zone
    image.click()

    const zone = screen.getByTestId('zone-to-tag')
    expect(zone).toBeInTheDocument()

    // adding a description and validating it
    const input = screen.getByTestId('description-input')
    userEvent.type(input, 'desc')
    const tagBtn = screen.getByTestId('tag-button')
    tagBtn.click()

    expect(callback).toHaveBeenCalledWith([
      {
        description: 'desc',
        zone: { height: 60, left: -60, top: -60, width: 60 }
      }
    ])
  })

  it('should remove it when clicking on the remove button', () => {
    const callback = jest.fn()

    render(
      <ImgTagger
        tags={[
          {
            description: 'to remove',
            zone: { top: 0, left: 0, width: 10, height: 20 }
          }
        ]}
        image=""
        updateTags={callback}
      />
    )

    const removeBtn = screen.getByTestId('remove-button')
    expect(removeBtn).toBeInTheDocument()
    removeBtn.click()

    expect(callback).toHaveBeenCalledWith([])
  })

  it('should edit it when double clicking on it', () => {
    const callback = jest.fn()

    render(
      <ImgTagger
        tags={[
          {
            description: 'to edit',
            zone: { top: 0, left: 0, width: 10, height: 20 }
          }
        ]}
        image=""
        updateTags={callback}
      />
    )

    const toBeEdited = screen.getByTitle('to edit')
    expect(toBeEdited).toBeInTheDocument()
    userEvent.dblClick(toBeEdited)

    const zone = screen.getByTestId('zone-to-tag')
    expect(zone).toBeInTheDocument()
  })
})
