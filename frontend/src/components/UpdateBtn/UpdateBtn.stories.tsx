import type { Meta, StoryObj } from '@storybook/react-vite';
import UpdateBtn from './UpdateBtn';

const meta: Meta<typeof UpdateBtn> = {
  title: 'Components/UpdateBtn',
  component: UpdateBtn,
  argTypes: {
    status: {
      control: 'radio',
      options: ['initial', 'updating', 'updated'],
    },
    onClick: { action: 'clicked' }, // ボタンクリックイベントをログに表示
  },
};

export default meta;

type Story = StoryObj<typeof UpdateBtn>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    status: 'initial',
  },
};
