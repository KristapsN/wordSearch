import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { FC } from 'react';

type AlertToastProps = {
  open: boolean;
  setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}

const AlertToast: FC<AlertToastProps> = ({ open, setOpenAlert, message }) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      // eslint-disable-next-line no-useless-return
      return;
    }
    setOpenAlert(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="warning">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertToast;
