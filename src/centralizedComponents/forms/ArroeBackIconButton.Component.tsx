import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';


interface BackArrowIconButtonProps {

  onClick: () => void;

}


const BackArrowIconButton: React.FC<BackArrowIconButtonProps> = ({ onClick }) => {
  const theme = useTheme(); 
  const ArrowIcons = {
    color: theme.palette.mode === "dark" ? "#000000" : "#000000",
};

  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <div className="button-box">
          <span className="button-elem">
            <ArrowBackIcon sx={{color: ArrowIcons.color }} />
          </span>
          <span className="button-elem">
            <ArrowBackIcon sx={{color: ArrowIcons.color }} />
          </span>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled('div')(({ theme }) => ({
  '.button': {
    display: 'block',
    position: 'relative',
    width: '72px',
    height: '72px',
    margin: 0,
    overflow: 'hidden',
    outline: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    border: 0,
  },

  '.button:before': {
    content: '""',
    position: 'absolute',
    borderRadius: '50%',
    inset: '7px',
    border: `3px solid ${
        theme.palette.mode === 'dark' ? '#000000' : '#000000'
      }`,
    transition:
      'opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms, transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms',
  },

  '.button:after': {
    content: '""',
    position: 'absolute',
    borderRadius: '50%',
    inset: '7px',
    border: '4px solid #74d52b',
    transform: 'scale(1.3)',
    transition:
      'opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: 0,
  },

  '.button:hover:before, .button:focus:before': {
    opacity: 0,
    transform: 'scale(0.7)',
    transition:
      'opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  '.button:hover:after, .button:focus:after': {
    opacity: 1,
    transform: 'scale(1)',
    transition:
      'opacity 0.4s cubic-bezier(0.77, 0, 0.175, 1) 80ms, transform 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) 80ms',
  },

  '.button-box': {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  '.button-elem': {
    display: 'block',
    width: '30px',
    height: '30px',
    margin: '24px 18px 0  22px',
    transform: 'rotate(360deg)',
    fill: '#f0eeef',
  },

  '.button:hover .button-box, .button:focus .button-box': {
    transition: '0.4s',
    transform: 'translateX(-69px)',
  },
}));

export default BackArrowIconButton;
