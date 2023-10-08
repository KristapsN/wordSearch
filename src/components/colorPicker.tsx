import Button from '@mui/material/Button';
import React, { Dispatch, FC } from 'react';
import { SketchPicker, Color } from 'react-color';
import Popover from '@mui/material/Popover';

type ColorPickerProps = {
  colorValue: string
  setColorValue: Dispatch<React.SetStateAction<string>>
  buttonOpen: boolean
  setButtonOpen: Dispatch<React.SetStateAction<boolean>>
}

const ColorPicker: FC<ColorPickerProps> = ({
  colorValue, setColorValue, buttonOpen, setButtonOpen,
}) => {
  const buttonSX = {
    backgroundColor: colorValue,
    minWidth: '30px',
    height: '30px',
    '&:hover': {
      backgroundColor: colorValue,
    },
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setButtonOpen(!buttonOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setButtonOpen(false);
  };

  return (
    <div>
      <Button sx={buttonSX} onClick={handleClick} />
      <Popover
        open={buttonOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <>
          <SketchPicker color={colorValue} onChangeComplete={(color) => setColorValue(color.hex)} />
        </>
      </Popover>
    </div>
  );
};

export default ColorPicker;
