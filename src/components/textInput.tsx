/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from 'react';
import style from './cell.module.scss';

type TextAreaProps = {
  textChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label: string;
  placeholder: string,
  maxLength?: number;
  letterCount?: boolean;
}

const TextInput: FC<TextAreaProps> = ({
  textChangeHandler, value, label, maxLength, placeholder, letterCount,
}) => (
  <div className={style.inputWrapper}>
    <label className={style.inputLabel}>
      <span className={style.inputLabelWrapper}>{label}</span>
      <input
        id="textInput"
        className={style.textInput}
        placeholder={placeholder}
        maxLength={maxLength}
        type="text"
        value={value}
        onChange={(e) => textChangeHandler(e)}
      />
    </label>
    {letterCount
    && (
      <div className={style.counterAndWarningWrapper}>
        <div className={style.letterCountWarningWrapper}>
          {value.length === maxLength
        && (
          <span className={style.letterCountWarning}>
            You have reached maximum count of characters
          </span>
        )}
        </div>
        <div className={style.letterCountWrapper}>
          <span className={style.letterCount}>
            {`${value.length} /${maxLength}`}
          </span>
        </div>
      </div>
    )}
  </div>
);

export default TextInput;
