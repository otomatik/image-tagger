declare module 'react-resizable-rotatable-draggable' {
  import { Zone } from '../components/ImgTagger'

  export default class ResizableRect extends React.Component<Props> {}

  interface Props {
    top: number
    left: number
    width: number
    height: number
    zoomable: string
    onDrag(deltaX: number, deltaY: number): void
    onResize(zone: Zone): void
  }
}
