import React from 'react'
import { Input, Label } from '@rebass/forms'
import * as S from './styles'

import { Tag } from '../ImgTagger'

interface Props {
  dataImported: (image: string, tags?: Tag[]) => void
  importFailed?: () => void
}

const ImgImporter = ({ dataImported, importFailed }: Props) => {
  const onImportImage = (files: FileList | null) => onImport(files, false)
  const onImportJson = (files: FileList | null) => onImport(files, true)
  const onImport = (files: FileList | null, isJson: boolean) => {
    if (!files || files.length < 1) {
      return
    }
    const file = files[0]

    const onLoaded = () => {
      try {
        let image = reader.result as string
        let tags = []
        if (isJson) {
          const parsed = JSON.parse(image)
          image = parsed['image']
          tags = parsed['tags']
        }
        dataImported(image, tags)
      } catch (_) {
        importFailed?.()
      }
    }

    const reader = new FileReader()
    reader.addEventListener('load', onLoaded)
    importFailed && reader.addEventListener('error', importFailed)

    if (isJson) {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  }
  return (
    <>
      <S.Importer>
        <Label htmlFor="image">Import an image:</Label>
        <Input
          title="Import image"
          type="file"
          accept="image/*"
          name="image"
          multiple={false}
          data-testid="import-image-input"
          onChange={(event) => onImportImage(event.target.files)}
          mt={2}
        />
      </S.Importer>
      <S.Importer>
        <Label htmlFor="json">or a Json file:</Label>
        <Input
          title="Import json"
          type="file"
          name="json"
          multiple={false}
          data-testid="import-json-input"
          onChange={(event) => onImportJson(event.target.files)}
          mt={2}
        />
      </S.Importer>
    </>
  )
}

export default ImgImporter
