import React, { Dispatch, FC } from 'react';
import Slider from '@mui/material/Slider';

type SliderInputProps = {
  inputValue: number
  setValue: Dispatch<React.SetStateAction<number>>
  maxVal: number
  minVal: number
  stepVal: number
}

const SliderInput: FC<SliderInputProps> = ({
  inputValue, setValue, maxVal, minVal, stepVal,
}) => (
  <Slider
    size="small"
    defaultValue={inputValue}
    aria-label="Default"
    valueLabelDisplay="auto"
    marks
    step={stepVal}
    min={minVal}
    max={maxVal}
    onChange={(_, value) => setValue(value as number)}
  />
);

export default SliderInput;
