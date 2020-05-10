import React from 'react';

import './Button.scss';

interface IButtonProps {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  small?: boolean;
}

/** Defines a reusable button component. */
export default function Button(props: IButtonProps) {
  const { children, onClick = () => {}, disabled = false, className = '', small = false } = props;

  const classes = [
    className ? className : null,
    disabled ? 'button--disabled' : null,
    small ? 'button--small' : null
  ].filter(Boolean).join(' ');

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>{children}</button>
  )
}
