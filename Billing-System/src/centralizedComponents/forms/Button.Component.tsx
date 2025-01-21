import React from 'react';
import Button, { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { SxProps, Theme, useMediaQuery } from '@mui/material';

interface ButtonProps {
    label: string | React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
    variant?: 'contained' | 'outlined' | 'text';
    onClick: (e: React.MouseEvent) => void;
    icon?: React.ReactNode;
    sx?: SxProps<Theme>;
}

const getColor = (color: string, theme: Theme) => {
    if (color === 'error') {
        return theme.palette.error.main;
    } else {
        return theme.palette.primary.main;
    }
};

const StyledButton = styled(Button)<MUIButtonProps>(({ theme, color, variant }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(variant === 'outlined' && {
        borderColor: color === 'secondary' ? theme.palette.secondary.main : getColor(color ?? '', theme),
        color: color === 'secondary' ? theme.palette.secondary.main : getColor(color ?? '', theme),
    }),
}));


const ButtonComponents: React.FC<ButtonProps> = ({
    label,
    size = 'medium',
    color = '',
    variant = 'contained',
    onClick,
    icon,
    sx,
}) => {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.between('sm', 'md'));

    const getSizeBasedOnDevice = () => {
        if (isMobile) {
            return 'small';
        } else if (isTablet) {
            return 'medium';
        } else {
            return size;
        }
    };

    const responsiveSize = getSizeBasedOnDevice(); const tabletPadding = isTablet ? '8px 16px' : '10px 20px';
    const responsivePadding = isMobile ? '6px 12px' : tabletPadding;
    const calculateResponsiveWidth = () => {
        if (isMobile) {
            return '90%';
        } else if (isTablet) {
            return '70%';
        } else {
            return '100%';
        }
    };
    return (
        <StyledButton
            onClick={(event) => onClick(event)}
            size={responsiveSize}
            color={color ? color as 'primary' | 'secondary' | 'error' | 'success' | 'warning' : 'primary'}
            variant={variant}
            startIcon={icon}
            sx={{
                borderRadius: '20px',
                padding: responsivePadding,
                margin: '10px 5px',
                fontWeight: 'bold',
                width: calculateResponsiveWidth(),
                alignItems: 'center',
                ...sx,
            }}
        >
            {label}
        </StyledButton>
    );
};

export default ButtonComponents;
