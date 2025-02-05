import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import FlashSale from "./Tabs/FlashSale";
import SpecialOffer from "./Tabs/SpecialOffer";

const OffersPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#7cc323" }}>
        Offers Page
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="Offers Tabs"
        sx={{
          marginBottom: 3,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-indicator": {
            backgroundColor: "#7cc323",
            height: 4,
            borderRadius: 2,
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.3s ease",
            "&.Mui-selected": {
              backgroundColor: "#f0f9eb", // Light green background for active tab
              color: "#7cc323",
            },
            "&:hover": {
              backgroundColor: "#e8f5e9",
            },
          },
        }}
      >
        <Tab label="🔥 Flash Sale" />
        <Tab label="🎉 Special Offer" />
      </Tabs>

      {/* Render components based on selected tab */}
      {selectedTab === 0 && <FlashSale />}
      {selectedTab === 1 && <SpecialOffer />}
    </Box>
  );
};

export default OffersPage;
