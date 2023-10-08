import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { fas } from '@fortawesome/free-brands-svg-icons'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons';
import './cell.css';

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
    <button className="toolbarButton" onClick={() => clickHandler()} disabled={disabled}>
      <div className="buttonContentWrapper">
        <FontAwesomeIcon className="buttonIcon" icon={icon} />
        {name}
      </div>
    </button>
  </>
);

export default ToolbarButton;
