import Section4 from './Section4';

export default {
  title: 'Components/Section4',
  component: Section4,
};

export const Default = () => (
  <Section4
    repositories={14}
    total_bytes={123456}
    activity_grade={5}
    charisma_grade={4}
  />
);
