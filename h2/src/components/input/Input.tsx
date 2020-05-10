/**
 * Reuseable component for user input.
 */
import React from 'react';

import './Input.scss';

function classnames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface IInputProps {
  type?: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  label: string;
  className?: string;
  options?: any[];
  invalid?: boolean;
}

export default function Input(props: IInputProps) {
  const { type = 'text', name, value, onChange, label, className = '', options = [], invalid = false } = props;

  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';
  const isInput = !isTextarea && !isSelect;

  return (
    <div className={classnames('input', invalid ? 'input--invalid' : '', className ? className : '')}>
      {label && (
        <label className="input__label" htmlFor={name}>{label}</label>
      )}

      {isTextarea && (
        <textarea
          className="input__textarea"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
        />
      )}

      {isInput && (
        <input
          className="input__input"
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />
      )}

      {isSelect && (
        <select onChange={onChange} name={name} className="input__select" value={value}>
          {options.map((option: any, i: number) => (
            <option key={i} value={option.value}>{option.label}</option>
          ))}
        </select>
      )}
    </div>
  );
}
