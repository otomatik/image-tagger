import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
  useState
} from 'react'
import ResizableRect from 'react-resizable-rotatable-draggable'

import * as S from './styles'

import DescriptionInput from '../DescriptionInput'

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
  image: string | null
  tags: Tag[]
  updateTags: Dispatch<SetStateAction<Tag[]>>
  zoneWidth?: number
  zoneHeight?: number
}

const DEFAULT_WIDTH = 60
const DEFAULT_HEIGHT = 60
const DEFAULT_DESCRIPTION = ''

const ImgTagger = ({
  image,
  tags,
  updateTags,
  zoneWidth = DEFAULT_WIDTH,
  zoneHeight = DEFAULT_HEIGHT
}: Props) => {
  const initialZone = { width: 0, height: 0, top: 0, left: 0 }
  const [zone, setZone] = useState<Zone>(initialZone)
  const [limits, setLimits] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  })

  const [pendingDescription, setPendingDescription] = useState<string>(
    DEFAULT_DESCRIPTION
  )

  const restrictLeftLimitToImageBounds = (
    clientX: number,
    bounds: DOMRect
  ): number => {
    const left = Math.max(clientX - bounds.left - zoneWidth / 2, 0)
    const isOutOnRight = clientX - bounds.left + zoneWidth / 2 > bounds.width
    return isOutOnRight ? limits.right - zoneWidth : left
  }

  const restrictTopLimitToImageBounds = (
    clientY: number,
    bounds: DOMRect
  ): number => {
    const top = Math.max(clientY - bounds.top - zoneHeight / 2, 0)
    const isOutOnBottom = clientY - bounds.top + zoneHeight / 2 > bounds.height
    return isOutOnBottom ? limits.bottom - zoneHeight : top
  }

  const createZone = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const left = restrictLeftLimitToImageBounds(event.clientX, bounds)
    const top = restrictTopLimitToImageBounds(event.clientY, bounds)
    setZone({
      width: zoneWidth,
      height: zoneHeight,
      left,
      top
    })
  }

  const updateZone = (deltaX: number, deltaY: number) => {
    const newLeftPosition = zone.left + deltaX
    const newTopPosition = zone.top + deltaY

    const outsideLeftBorder = newLeftPosition < limits.left
    const outsideRightBorder = newLeftPosition > limits.right - zone.width
    const outsideTopBorder = newTopPosition < limits.top
    const outsideBottomBorder = newTopPosition > limits.bottom - zone.height

    if (
      outsideLeftBorder ||
      outsideRightBorder ||
      outsideTopBorder ||
      outsideBottomBorder
    ) {
      return
    }

    setZone({
      ...zone,
      left: newLeftPosition,
      top: newTopPosition
    })
  }

  const addTag = (tag: Tag) => {
    updateTags([...tags, tag])
  }

  const editTag = (index: number) => {
    const tag = tags[index]
    if (!tag) {
      return
    }
    setPendingDescription(tag.description)
    setZone({ ...tag.zone })
    removeTag(index)
  }

  const removeTag = (index: number) => {
    if (!tags || tags.length === 0) {
      return
    }
    tags.splice(index, 1)
    updateTags([...tags])
  }

  const confirmDescription = () => {
    if (zone?.width > 0 && zone?.height > 0) {
      addTag({ description: pendingDescription, zone })
      reset()
    }
  }

  const reset = () => {
    setZone(initialZone)
    setPendingDescription(DEFAULT_DESCRIPTION)
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
      {image && (
        <DescriptionInput
          value={pendingDescription}
          onChange={setPendingDescription}
          onConfirm={confirmDescription}
          onCancel={reset}
          disabled={zone.width === 0 && zone.height === 0}
        />
      )}
      <S.Tagger>
        {image && (
          <img
            src={image}
            onLoad={setBoundingClientRect}
            onClick={createZone}
          />
        )}
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
        {tags.map((tag, index) => (
          <S.Tag
            key={index}
            zone={tag.zone}
            title={tag.description}
            onDoubleClick={(_) => editTag(index)}
          >
            <S.Remove
              data-testid="remove-button"
              onClick={(_) => removeTag(index)}
            />
          </S.Tag>
        ))}
      </S.Tagger>
    </S.Wrapper>
  )
}

export default ImgTagger
