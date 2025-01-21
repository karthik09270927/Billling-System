import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

interface SearchInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}

const StyledWrapper = styled('form')(() => ({
  position: 'relative',
  width: '100%',
  maxWidth: '17em',
  margin: 'auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    borderRadius: '50%',
    boxShadow: '0 0 0 0.25em inset',
    caretColor: theme.palette.primary.main,
    width: '2em',
    height: '2em',
    transition: 'all 0.5s linear',
  },
  '& .MuiInputBase-input': {
    padding: 0,
    width: '100%',
    height: '100%',
  },
  '& .Mui-focused .MuiInputBase-root, .MuiInputBase-root:valid': {
    backgroundColor: theme.palette.background.default,
    borderRadius: '0.25em',
    boxShadow: 'none',
    padding: '0.75em 1em',
    width: '100%',
    height: '3em',
    transitionDuration: '0.25s',
    transitionDelay: '0.25s',
  },
}));

const StyledCaret = styled('span')(({ theme }) => ({
  backgroundColor: theme.palette.text.primary,
  borderRadius: '0 0 0.125em 0.125em',
  width: '0.25em',
  height: '1em',
  display: 'block',
  marginBottom: '-0.6em',
  position: 'absolute',
  transform: 'translate(0,-1em) rotate(-45deg) translate(0,0.875em)',
  transformOrigin: '50% 0',
  transition: 'all 0.5s linear',
}));

const SearchInput: React.FC<SearchInputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  onClick,
  required = false,
}) => (
  <StyledWrapper>
    <StyledTextField
      id={id}
      type="search"
      value={value}
      onChange={onChange}
      onClick={onClick}
      placeholder={placeholder}
      required={required}
      variant="outlined"
      InputProps={{ disableUnderline: true }}
    />
    <StyledCaret className="caret" />
  </StyledWrapper>
);

export default SearchInput;
