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
  image: string
  tags: Tag[]
  updateTags: Dispatch<SetStateAction<Tag[]>>
}

const ImgTagger = ({ image, tags, updateTags }: Props) => {
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
  const [pendingDescription, setPendingDescription] = useState<string>('')

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

  const addTag = (tag: Tag) => {
    updateTags([...tags, tag])
  }

  const editTag = (event: MouseEvent, index: number) => {
    if (!tags[index]) {
      return
    }
    const tag = tags[index]
    setPendingDescription(tag.description)
    setZone({ ...tag.zone })
    removeTag(event, index)
  }

  const removeTag = (event: MouseEvent, index: number) => {
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
    setZone({ width: 0, height: 0, top: 0, left: 0 })
    setPendingDescription('')
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
        {tags.map((tag, index) => (
          <S.Tag
            key={index}
            zone={tag.zone}
            title={tag.description}
            onDoubleClick={(event) => editTag(event, index)}
          >
            <S.Remove
              data-testid="remove-button"
              onClick={(event) => removeTag(event, index)}
            />
          </S.Tag>
        ))}
      </S.Tagger>
      {image === '' ? null : (
        <DescriptionInput
          value={pendingDescription}
          onChange={setPendingDescription}
          onConfirm={confirmDescription}
          onCancel={reset}
          disabled={zone.width === 0 && zone.height === 0}
        />
      )}
    </S.Wrapper>
  )
}

export default ImgTagger
