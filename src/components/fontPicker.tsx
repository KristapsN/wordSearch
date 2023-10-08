import React, { Dispatch, FC } from 'react';
import FontPicker from 'font-picker-react';
import './cell.css';

type FontPickerFieldProps = {
  activeFont: string
  setActiveFont: Dispatch<React.SetStateAction<string>>
  pickerName: string
}

const FontPickerField: FC<FontPickerFieldProps> = ({ activeFont, setActiveFont, pickerName }) => (
  <div className="fontPicker">
    <FontPicker
      apiKey={process?.env?.REACT_APP_GOOGLE_FONT_API_KEY ?? ''}
      activeFontFamily={activeFont}
      pickerId={pickerName}
      onChange={(nextFont) => setActiveFont(nextFont.family)}
    />
  </div>
);

export default FontPickerField;
