import React, { ChangeEvent } from 'react';

export interface InputProps {
  label: string;
  type?: string;
  defaultValue: string | string[];
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type = 'text',
  defaultValue,
  onChange,
}: InputProps) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} defaultValue={defaultValue} onChange={onChange} />
    </label>
  );
}
