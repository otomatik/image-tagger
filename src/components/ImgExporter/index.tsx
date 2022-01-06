import React from 'react'
import { saveAs } from 'file-saver'

import * as S from './styles'
import { Tag } from '../ImgTagger'
import { Button } from 'rebass'

interface Props {
  disabled: boolean
  image: string
  tags: Tag[]
}

const ImgExporter = ({ image, tags, disabled }: Props) => {
  const onSave = () => {
    const data = JSON.stringify({ image, tags })
    const blob = new Blob([data], {
      type: 'application/json;charset=utf-8'
    })
    saveAs(blob, 'image.json')
  }
  return (
    <S.Wrapper>
      <Button
        variant="outline"
        sx={{
          ':hover': {
            backgroundColor: 'blue',
            color: 'white',
            cursor: 'pointer'
          },
          ':disabled': {
            backgroundColor: 'lightgrey',
            color: 'white',
            cursor: 'not-allowed'
          }
        }}
        onClick={onSave}
        disabled={disabled}
      >
        Save
      </Button>
    </S.Wrapper>
  )
}

export default ImgExporter
