import { useState } from 'react'
import * as S from './styles'

import ImgImporter from '../ImgImporter'
import ImgTagger, { Tag } from '../ImgTagger'

const Main = () => {
  const [image, setImage] = useState<string>('')
  const [tags, setTags] = useState<Tag[]>([])
  return (
    <S.Wrapper>
      <ImgImporter
        dataImported={(image, tags?) => {
          setImage(image)
          tags && setTags(tags)
        }}
        importFailed={() => alert('error while loading')}
      />
      <ImgTagger image={image} tags={tags} updateTags={setTags} />
    </S.Wrapper>
  )
}

export default Main
