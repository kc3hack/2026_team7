import type { Meta, StoryObj } from '@storybook/react-vite';
import Section1 from './Section1';

const meta: Meta<typeof Section1> = {
  title: 'Components/Section1',
  component: Section1,
  argTypes: {
    user_name: { control: 'text' },
    user_id: { control: 'text' },
    registration_date: { control: 'date' },
    level: { control: 'number' },
    title_name: { control: 'text' },
    skill_update_date: { control: 'date' },
  },
};

export default meta;

type Story = StoryObj<typeof Section1>;

export const Default: Story = {
  args: {
    user_name: 'ゆーと',
    user_id: 'yutota13',
    registration_date: '2019-03-10',
    level: 120,
    title_name: '暁のエンジニア',
    skill_update_date: '2026-02-17T05:43:32',
  },
};