import { render, screen } from '@testing-library/react'

import ImgTagger from '.'

describe('<ImgTagger />', () => {
  it('should create a tag zone when clicking on the image', () => {
    render(<ImgTagger image="fake image" />)

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()

    // create a tag zone
    image.click()

    const zone = screen.getByTestId('zone-to-tag')
    expect(zone).toBeInTheDocument()
  })
})
