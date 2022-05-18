import React, { FC } from 'react';
import style from './cell.module.scss';

type TabButtonProps = {
  clickHandler: () => void;
  name: string;
  active?: boolean;
  disabled?: boolean;

}

const TabButton: FC<TabButtonProps> = ({
  clickHandler, name, disabled, active,
}) => (
  <>
    <button className={active ? style.tabButtonActive : style.tabButton} onClick={() => clickHandler()} disabled={disabled}>
      {name}
    </button>
  </>
);

export default TabButton;
