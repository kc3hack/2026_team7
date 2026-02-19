import type { Meta, StoryObj } from '@storybook/react-vite';
import Section1 from './Section1';

const meta: Meta<typeof Section1> = {
  title: 'Components/Section1',
  component: Section1,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'number', min: 1, max: 99 },
    },
    registeredDate: {
      control: 'text',
    },
    updatedDate: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Section1>;

/* =========================
   Default
========================= */

export const Default: Story = {
  args: {
    userName: 'Taro Yamada',
    userId: 'ENG-00123',
    registeredDate: '2019-03-10',
    title: 'Frontend Engineer',
    level: 28,
    imageUrl: 'https://placehold.jp/300x300.png?text=Engineer',
    updatedDate: '2026.02.17 05:43:32',
  },
};

/* =========================
   Senior Engineer
========================= */

export const SeniorEngineer: Story = {
  args: {
    userName: 'Alex Johnson',
    userId: 'DEV-2048',
    registeredDate: '2015-09-15',
    title: 'Full Stack Developer',
    level: 45,
    imageUrl: 'https://placehold.jp/300x300.png?text=Senior',
    updatedDate: '2026.02.10 14:12:03',
  },
};

/* =========================
   Junior Engineer
========================= */

export const JuniorEngineer: Story = {
  args: {
    userName: 'Sakura Tanaka',
    userId: 'ENG-00999',
    registeredDate: '2024-04-01',
    title: 'Junior Backend Engineer',
    level: 5,
    imageUrl: 'https://placehold.jp/300x300.png?text=Junior',
    updatedDate: '2026.02.18 09:01:22',
  },
};

/* =========================
   Max Level (UI確認用)
========================= */

export const MaxLevel: Story = {
  args: {
    userName: 'Chris Miller',
    userId: 'ARCH-9999',
    registeredDate: '2010-01-01',
    title: 'Principal Engineer',
    level: 99,
    imageUrl: 'https://placehold.jp/300x300.png?text=Master',
    updatedDate: '2026.02.01 00:00:00',
  },
};
