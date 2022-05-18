/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from 'react';
import style from './cell.module.scss';

type TextAreaProps = {
  textChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  label: string;
  bigText?: boolean;
  maxLength?: number;
  error?: boolean;
  tooLong?: string[];
  placeholder?: string;
  letterCount?: boolean;
}

const TextArea: FC<TextAreaProps> = ({
  textChangeHandler, value, label, bigText, maxLength, error, tooLong, placeholder, letterCount,
}) => (
  <div className={style.inputWrapper}>
    <label className={style.inputLabel}>
      <span className={style.inputLabelWrapper}>{label}</span>
      <textarea
        className={style.textInput}
        maxLength={maxLength}
        placeholder={placeholder}
        style={{
          minHeight: `${bigText ? 150 : 100}px`,
        }}
        value={value}
        onChange={(e) => textChangeHandler(e)}
      />
    </label>
    <div style={{ marginBottom: 5 }}>
      {error && tooLong && tooLong?.length === 0
    && (
    <samp className={style.errorMessage}>
      Try again, if that does not help remove some words and then try again
    </samp>
    )}
      {tooLong && tooLong?.length > 0
    && (
    <span className={style.errorMessage}>
      {`These words are too long: ${tooLong.join(', ')}`}
    </span>
    )}
    </div>
    {letterCount
    && (
      <div className={style.textAreaCounterAndWarningWrapper}>
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

export default TextArea;
