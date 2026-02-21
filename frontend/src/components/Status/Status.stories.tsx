import type { Meta, StoryObj } from '@storybook/react-vite';
import Status from './Status';

const meta: Meta<typeof Status> = {
  title: 'Components/Status',
  component: Status,
  argTypes: {
    status: {
      control: 'radio',
      options: ['initial', 'updating', 'updated'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Status>;

export const Default: Story = {
  args: {
    status: 'initial',
  },
};
