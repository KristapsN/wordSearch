import React, { FC } from 'react';
import { v4 as uuidv4 } from 'uuid';
import style from './cell.module.scss';

type OptionsProps = {
  option: number
  name: string
}

type SelectProps = {
  options: OptionsProps[]
  value: number
  selectHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({ options, value, selectHandler }) => (
  <>
    {/* <label for="cars">Choose a car:</label> */}

    <select
      name="action"
      id="action"
      value={value}
      onChange={(e) => selectHandler(e)}
    >
      {options.map(({ option, name }) => (
        <option key={uuidv4()} value={option}>{name}</option>
      ))}

    </select>
  </>
);

export default Select;
