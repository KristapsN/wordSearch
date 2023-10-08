import React, { FC } from 'react';
import Button from '@mui/material/Button';

type ButtonProps = {
  clickHandler: () => void;
  name: string;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
}

const ButtonFIlled: FC<ButtonProps> = ({
  clickHandler, name, disabled, variant,
}) => (
  <>
    <Button
      // className={mainStyle ? style.mainButton : style.secondaryStyle}
      onClick={() => clickHandler()}
      disabled={disabled}
      variant={variant || 'text'}
    >
      {name}
    </Button>
  </>
);

export default ButtonFIlled;
