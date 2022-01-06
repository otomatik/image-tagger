import { useState } from 'react'
import * as S from './styles'

import ImgImporter from '../ImgImporter'
import ImgExporter from '../ImgExporter'
import ImgTagger, { Tag } from '../ImgTagger'

const Main = () => {
  const [image, setImage] = useState<string>('')
  const [tags, setTags] = useState<Tag[]>([])
  return (
    <S.Wrapper>
      <S.Head>
        <ImgImporter
          dataImported={(image, tags?) => {
            setImage(image)
            tags && setTags(tags)
          }}
          importFailed={() => alert('error while loading')}
        />
        <ImgExporter image={image} tags={tags} disabled={tags.length === 0} />
      </S.Head>
      <ImgTagger image={image} tags={tags} updateTags={setTags} />
    </S.Wrapper>
  )
}

export default Main
