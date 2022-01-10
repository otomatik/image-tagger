import { Story, Meta } from '@storybook/react/types-6-0'
import ImgExporter from '.'

export default {
  title: 'ImgExporter',
  component: ImgExporter
} as Meta

export const Default: Story = () => (
  <ImgExporter
    tags={[
      {
        description: 'to export',
        zone: { top: 0, left: 0, width: 10, height: 20 }
      }
    ]}
    image="fake image"
  />
)
