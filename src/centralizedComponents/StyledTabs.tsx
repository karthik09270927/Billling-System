import React from "react";
import { styled, Tab, Tabs } from "@mui/material";

interface StyledTabsProps {
    children?: React.ReactNode;
    value: string;
    onChange: (_event: React.SyntheticEvent, newValue: string) => void;
    sx?: any;
}

export const StyledTabs = styled((props: StyledTabsProps) => {
    return (
        <Tabs
            {...props}
            TabIndicatorProps={{
                children: <span className="MuiTabs-indicatorSpan" />,
            }}
        />
    );
})(({ theme }) => ({
    "& .MuiTabs-indicator": {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        height: "3px",
        bottom: "10px",
    },
    "& .MuiTabs-indicatorSpan": {
        maxWidth: 20,
        width: "100%",
        backgroundColor: theme.palette.mode === "dark" ? '#00ffd7' : '#599a53',
        borderRadius: "25px",
    },
    "& .MuiTabs-flexContainer": {
        justifyContent: "center",
    },
}));

interface StyledTabProps {
    label: string;
    value: string;
    sx?: any;
}

export const StyledTab = styled((props: StyledTabProps) => {
    return <Tab disableRipple {...props} />;
})(({ theme }) => ({
    textTransform: "none",
    fontSize: "24px",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
    "&.Mui-selected": {
        color: theme.palette.mode === "dark" ? '#00ffd7' : '#599a53',
    },
    "&.Mui-focusVisible": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? 'rgba(0, 255, 215, 0.2)' : 'rgba(104, 160, 20, 0.2)',
    },
}));
