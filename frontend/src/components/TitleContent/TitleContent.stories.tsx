import type { Meta, StoryObj } from '@storybook/react-vite';
import TitleContent from './TitleContent';

const meta: Meta<typeof TitleContent> = {
  title: 'Components/TitleContent',
  component: TitleContent,
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof TitleContent>;

export const Default: Story = {
  args: {
    title: 'Location',
    content: 'これはサンプルテキストです。Storybook の Controls で変更可能。',
  },
};