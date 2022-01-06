import { Story, Meta } from '@storybook/react/types-6-0'
import ImgImporter from '.'

export default {
  title: 'ImgImporter',
  component: ImgImporter
} as Meta

const noOp = () => null

export const Default: Story = () => <ImgImporter dataImported={noOp} />
