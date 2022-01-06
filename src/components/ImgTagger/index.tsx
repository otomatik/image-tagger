import { MouseEvent, SyntheticEvent, useState } from 'react'
import ResizableRect from 'react-resizable-rotatable-draggable'

import * as S from './styles'

export interface Zone {
  left: number
  top: number
  width: number
  height: number
}

export interface Tag {
  description: string
  zone: Zone
}

interface Props {
  image: string
}

const ImgTagger = ({ image }: Props) => {
  const [zone, setZone] = useState<Zone>({
    width: 0,
    height: 0,
    left: 0,
    top: 0
  })
  const [limits, setLimits] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })

  const createZone = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const width = 60
    const height = 60
    let left = Math.max(event.clientX - bounds.left - width / 2, 0)
    if (event.clientX - bounds.left + width / 2 > bounds.width) {
      left = limits.right - width
    }
    let top = Math.max(event.clientY - bounds.top - height / 2, 0)
    if (event.clientY - bounds.top + height / 2 > bounds.height) {
      top = limits.bottom - height
    }
    setZone({
      width,
      height,
      left,
      top
    })
  }

  const updateZone = (deltaX: number, deltaY: number) => {
    if (zone.left + deltaX < limits.left) return
    if (zone.left + deltaX > limits.right - zone.width) return
    if (zone.top + deltaY < limits.top) return
    if (zone.top + deltaY > limits.bottom - zone.height) return

    setZone({
      ...zone,
      left: zone.left + deltaX,
      top: zone.top + deltaY
    })
  }

  const setBoundingClientRect = ({
    currentTarget
  }: SyntheticEvent<HTMLImageElement>) => {
    const { top, left } = currentTarget.getBoundingClientRect()
    setLimits({
      top: top - currentTarget.y,
      left: left - currentTarget.x,
      right: left - currentTarget.x + currentTarget.width,
      bottom: top - currentTarget.y + currentTarget.height
    })
  }

  const handleResize = ({ top, left, width, height }: Zone) => {
    top = Math.round(top)
    left = Math.round(left)
    width = Math.round(width)
    height = Math.round(height)
    if (
      top >= limits.top &&
      left >= limits.left &&
      top + height <= limits.bottom &&
      left + width <= limits.right
    ) {
      setZone({
        top,
        left,
        width,
        height
      })
    }
  }

  return (
    <S.Wrapper>
      <S.Tagger>
        <img src={image} onLoad={setBoundingClientRect} onClick={createZone} />
        {zone.width > 0 && zone.height > 0 && (
          <span data-testid="zone-to-tag">
            <ResizableRect
              top={zone.top}
              left={zone.left}
              width={zone.width}
              height={zone.height}
              zoomable="n, w, s, e, nw, ne, se, sw"
              onDrag={updateZone}
              onResize={handleResize}
            />
          </span>
        )}
      </S.Tagger>
    </S.Wrapper>
  )
}

export default ImgTagger
