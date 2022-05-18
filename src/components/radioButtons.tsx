import React, { FC } from 'react';
import style from './cell.module.scss';

type TextAreaProps = {
  radioHandler: () => void;
  value: string;
  label: string;
  checked: boolean;
  name: string;
}

const RadioButton: FC<TextAreaProps> = ({
  radioHandler, value, label, checked, name,
}) => (
  // <div className={style.inputWrapper}>
  <label htmlFor="radio" className={style.containerRadio}>
    <input
      id="radio"
      type="radio"
      className={style.radioInput}
      value={value}
      onChange={() => radioHandler()}
      checked={checked}
      name={name}
    />
    <span className={style.checkmarkRadio}>
      {label}
    </span>
  </label>
  // </div>
);

export default RadioButton;
