import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import noDataDark from '../../assets/Data unavailable(dark).png';
import noDataLight from '../../assets/Data unavailable(light).png';

export const NoDataImage = () => {
    const theme = useTheme();
  
    return (
        <Box
        component="img"
        src={theme.palette.mode === 'dark' ? noDataDark : noDataLight}
        alt="No Data"
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    );
  };
  