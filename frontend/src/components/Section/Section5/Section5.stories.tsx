import Section5 from './Section5';

export default {
  title: 'Components/Section5',
  component: Section5,
};

export const Default = () => (
  <Section5
    languageSkills={[
      { name: 'JavaScript', bytes: 1024 },
      { name: 'Python', bytes: 2048 },
    ]}
  />
);
