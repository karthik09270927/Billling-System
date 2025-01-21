import { forwardRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, ListItemText, SxProps, Theme, Typography, FormHelperText, FormControl } from '@mui/material';

interface InputSelectProps {
  name: string;
  value: string[] | string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  options: { name: string; id: string }[];
  multiple?: boolean;
  Selectlabel?: any;
  onChange: (value: string | string[]) => void;
  height?: string | number;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
}

export const Inputselectcomponent = forwardRef<HTMLInputElement, InputSelectProps>(
  (
    {
      name,
      value,
      fullWidth = true,
      disabled = false,
      required,
      options,
      height = 'auto',
      multiple = false,
      Selectlabel,
      onChange,
      size = 'small',
      sx,
      error = false,
      helperText,
    },
    ref
  ) => {

    


    return (
      <div>
        <Typography style={{ fontWeight: '', fontSize: 'small' }}>
          {Selectlabel}
        </Typography>
        <FormControl sx={{ m: 0, width: '100%', ...sx, mt: 2 }} variant="outlined" error={error}>
          <Select
            inputRef={ref}
            displayEmpty
            disabled={disabled}
            fullWidth={fullWidth}
            multiple={multiple}
            size={size}
            required={required}
            onChange={(event: SelectChangeEvent<string | string[]>) => onChange(event.target.value)}
            value={value}
            name={name}
            sx={{ height: height }}
          >
            {options.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {multiple && (
                  <Checkbox checked={value.indexOf(option.id) > -1} />
                )}
                <ListItemText primary={option.name} />
              </MenuItem>
            ))}
          </Select>
          {error && helperText && <FormHelperText >{helperText}</FormHelperText>}
        </FormControl>
      </div>
    );
  }
);
