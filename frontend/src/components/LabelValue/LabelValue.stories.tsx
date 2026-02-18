import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabelValue } from './LabelValue';

const meta: Meta<typeof LabelValue> = {
  title: 'Components/LabelValue',
  component: LabelValue,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof LabelValue>;

export const Default: Story = {
  args: {
    label: 'Repositories',
    value: '68',
  },
};
