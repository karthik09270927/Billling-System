import React from 'react';
import { OutlinedInput, FormControl, InputAdornment, Typography, FormHelperText } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import { useTheme } from '@mui/material/styles';


interface ReusableInputProps {
  value?: string | string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
  id: string;
  type?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  sx?: SxProps<Theme>;
  placeholder?: string;
  endAdornment?: React.ReactNode;
  height?: string | number;
  Textlabel?: string;
  isColorPicker?: boolean;
  name?: string;
  error?: boolean;
  helperText?: string;
}

export const Inputtextcomponent: React.FC<ReusableInputProps> = ({
  value,
  onChange,
  label,
  name,
  id,
  type = 'text',
  inputProps,
  placeholder = '',
  sx,
  endAdornment,
  height = 'auto',
  Textlabel,
  isColorPicker = false,
  error = false,
  helperText,
}) => {

  const theme = useTheme();

  return (
    <Box>
      <Typography style={{ fontWeight: '500', fontSize: 'small' }}>
        {Textlabel}
      </Typography>
      <FormControl sx={{ m: 0, width: '25ch', ...sx, mt: 2 }} variant="outlined" error={error}>
        <OutlinedInput
          id={id}
          name={name}
          value={value}
          onChange={(event: any) => {
            if (onChange) {
              onChange(event);
            }
          }}
          type={isColorPicker ? 'color' : type}
          placeholder={isColorPicker ? undefined : placeholder}
          aria-describedby={`${id}-helper-text`}
          inputProps={inputProps}
          startAdornment={!isColorPicker && <InputAdornment position="start">{label}</InputAdornment>}
          endAdornment={endAdornment}
          sx={{
            width: '100%',
            height: height,
            '& .MuiInputBase-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1a293b' : '#f8fafc',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            }
          }}
        />
        {error && helperText && <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>}
      </FormControl>
    </Box>

  );
};


