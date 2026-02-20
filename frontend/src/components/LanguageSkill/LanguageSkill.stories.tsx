import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageSkill from './LanguageSkill';

const meta: Meta<typeof LanguageSkill> = {
  title: 'Components/LanguageSkill',
  component: LanguageSkill,
};

export default meta;

type Story = StoryObj<typeof LanguageSkill>;

export const Default: Story = {
  args: {
    language: 'JavaScript',
    score: 80,
    maxScore: 100,
  },
};
