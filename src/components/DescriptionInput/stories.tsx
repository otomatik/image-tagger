import { Story, Meta } from '@storybook/react/types-6-0'
import DescriptionInput from '.'

export default {
  title: 'DescriptionInput',
  component: DescriptionInput
} as Meta

const noOp = () => null

export const Default: Story = () => (
  <DescriptionInput
    value=""
    disabled={false}
    onConfirm={noOp}
    onCancel={noOp}
    onChange={noOp}
  />
)
