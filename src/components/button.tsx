import React, { FC } from 'react';
import style from './cell.module.scss';

type ButtonProps = {
  clickHandler: () => void;
  name: string;
  disabled?: boolean;
  mainStyle?: boolean;
}

const Button: FC<ButtonProps> = ({
  clickHandler, name, disabled, mainStyle,
}) => (
  <>
    <button className={mainStyle ? style.mainButton : style.secondaryStyle} onClick={() => clickHandler()} disabled={disabled}>
      {name}
    </button>
  </>
);

export default Button;
