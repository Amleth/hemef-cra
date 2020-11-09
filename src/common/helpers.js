import dayjs from 'dayjs';
import { TextField } from '@material-ui/core';
import React from 'react';

export function formatDate(d, h) {
  d = d ? d.split('^^')[0] : '';
  h = h ? h.replace('[', '').replace(']', '') + ' (hypothèse)' : '';
  d = d ? dayjs(d).format('DD/MM/YYYY') : '';
  return d || h;
}

export const formStyle = theme => ({
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 0,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      marginLeft: 0,
      marginRight: theme.spacing(4),
      minWidth: 300,
    },
  },
})

export function makeTextField(f, v, fw = false) {
  if (!v) v = '—'
  return (
    <TextField
      label={f}
      defaultValue={v}
      fullWidth={true}
      InputProps={{
        readOnly: true,
      }}
    />
  );
}