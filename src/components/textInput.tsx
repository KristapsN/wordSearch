/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC } from 'react';
import TextField from '@mui/material/TextField';
import './cell.css';

type TextAreaProps = {
  textChangeHandler: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value: string;
  label: string;
  placeholder: string,
  maxLength?: number;
  letterCount?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
}
const TextInput: FC<TextAreaProps> = ({
  textChangeHandler, value, label, maxLength, placeholder, letterCount, multiline, rows, type,
}) => (
  <div className="inputWrapper">
    {/* <label className={style.inputLabel}>
      <span className={style.inputLabelWrapper}>{label}</span> */}
    <TextField
      className="textInput"
      placeholder={placeholder}
      type={type || 'text'}
      value={value}
      onChange={(event) => textChangeHandler(event)}
      label={label}
      variant="outlined"
      size="small"
      multiline={multiline}
      rows={rows}
      inputProps={{ maxLength }}
      helperText={letterCount && `${value.length} /${maxLength}`}
    />
    {/* </label> */}
    {letterCount
    && (
      <div className="counterAndWarningWrapper">
        <div className="letterCountWarningWrapper">
          {value.length === maxLength
        && (
          <span className="letterCountWarning">
            You have reached maximum count of characters
          </span>
        )}
        </div>
        {/* <div className={style.letterCountWrapper}>
          <span className={style.letterCount}>
            {`${value.length} /${maxLength}`}
          </span>
        </div> */}
      </div>
    )}
  </div>
);

export default TextInput;
