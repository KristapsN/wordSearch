/* eslint-disable react/no-array-index-key */
import { FC } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

type IconListProps = {
  listItems: string[]
  answerSize: number
}
const IconList: FC<IconListProps> = ({ listItems, answerSize }) => (
  <div>
    <List dense>
      {listItems.map((item, index) => (
        <ListItem
          sx={{
          // '& .MuiSvgIcon-root': {
          //   fontSize: '1.2em',
          // },
            padding: 0,
          }}
          key={index}
        >
          <ListItemIcon sx={{ minWidth: 0 }}>
            <CheckBoxOutlineBlankIcon sx={{ fontSize: `${answerSize + 0}em` }} />
          </ListItemIcon>
          <ListItemText
            sx={{
              margin: 0,
              '& .MuiTypography-root': {
                fontSize: `${answerSize}em`,
                lineHeight: 'normal',
              },
            }}
            primary={item.toUpperCase()}
          />
        </ListItem>
      ))}
    </List>
  </div>
);

export default IconList;
