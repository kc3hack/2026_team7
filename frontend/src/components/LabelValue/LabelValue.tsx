import React from 'react';
import './LabelValue.css';

interface LabelValueProps {
  label: string;
  value: string | number;
}

export const LabelValue: React.FC<LabelValueProps> = ({ label, value }) => {
  return (
    <div className="label-value-item">
      <span className="label-value__label">{label}</span>
      <span className="label-value__value">{value}</span>
    </div>
  );
};
