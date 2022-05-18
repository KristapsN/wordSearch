import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fas } from '@fortawesome/free-brands-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import style from './cell.module.scss';

type ToolbarButtonProps = {
  clickHandler: () => void;
  name: string;
  disabled?: boolean;
  icon: any;

}

const ToolbarButton: FC<ToolbarButtonProps> = ({
  clickHandler, name, disabled, icon,
}) => (
  <>
    <button className={style.toolbarButton} onClick={() => clickHandler()} disabled={disabled}>
      <div className={style.buttonContentWrapper}>
        <FontAwesomeIcon className={style.buttonIcon} icon={icon} />
        {name}
      </div>
    </button>
  </>
);

export default ToolbarButton;
