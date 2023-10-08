import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { FC } from 'react';

export type toggleOption = {
  size: [number, number] | number;
  name: string;
};

type ToggleGroupProps = {
  radioHandler: (e: React.MouseEvent<HTMLElement>) => void;
  value: number | [number, number];
  options: toggleOption[];
}

const ToggleGroup: FC<ToggleGroupProps> = ({
  radioHandler, value, options,
}) => {
  const chosenSize = options.find((element) => element.size === value);

  return (
    <ToggleButtonGroup
      value={chosenSize?.name}
      exclusive
      onChange={(e) => radioHandler(e)}
      aria-label="text alignment"
    >
      {options.map(({ name }) => (
        <ToggleButton key={name} value={name} aria-label="left aligned">
          {name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
export default ToggleGroup;
