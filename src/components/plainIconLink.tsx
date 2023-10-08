import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './cell.css';

type PlainIconLinkProps = {
  clickHandler: () => void;
  name: string;
  disabled?: boolean;
  icon: any;

}

const PlainIconLink: FC<PlainIconLinkProps> = ({
  clickHandler, name, disabled, icon,
}) => (
  <>
    <button className="plainIconLink" onClick={() => clickHandler()} disabled={disabled}>
      <div className="buttonContentWrapper">
        <FontAwesomeIcon className="buttonIcon" icon={icon} />
        {name}
      </div>
    </button>
  </>
);

export default PlainIconLink;
