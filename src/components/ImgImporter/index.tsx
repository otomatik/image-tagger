import React from 'react'
import { Input } from '@rebass/forms'

import { Tag } from '../ImgTagger'

interface Props {
  dataImported: (image: string, tags?: Tag[]) => void
  importFailed?: () => void
}

const ImgImporter = ({ dataImported, importFailed }: Props) => {
  const onImport = (files: FileList | null) => {
    if (!files || files.length < 1) {
      return
    }
    const file = files[0]
    const isJsonFile = file.type === 'application/json'

    const onLoaded = () => {
      try {
        let image = reader.result as string
        let tags = []
        if (isJsonFile) {
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

    if (isJsonFile) {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  }
  return (
    <Input
      title="Import"
      type="file"
      multiple={false}
      data-testid="import-file-input"
      onChange={(event) => onImport(event.target.files)}
      mr={2}
    />
  )
}

export default ImgImporter
