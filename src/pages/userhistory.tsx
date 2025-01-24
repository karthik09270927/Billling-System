import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  IconButton,
  Chip,
  Box,
  InputAdornment,
  TextField,
  Collapse,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Download, FilterAlt } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import CentralizeDatePicker from "../centralizedComponents/forms/DatePicker";
import { dateStyle } from "../style/header.Style";
import SearchIcon from "@mui/icons-material/Search";

interface FormValues {
  startdate: string | null;
  enddate: string | null;
}

const orders = [

  {
    id: "001",
    date: "25/05/2024",
    customer: "George",
    status: "Done",
    payment: "USD 35.00",
    paymentStatus: "Paid",
  },
  {
    id: "002",
    date: "25/05/2024",
    customer: "Charlie",
    status: "Done",
    payment: "USD 12.50",
    paymentStatus: "Paid",
  },
  {
    id: "005",
    date: "25/05/2024",
    customer: "Eliza",
    status: "Canceled",
    payment: "USD 12.25",
    paymentStatus: "Unpaid",
  },

];

// Define columns for the DataGrid


const UserHistory: React.FC = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [_formData, _setFormData] = React.useState({

    startdate: "",
    enddate: "",

  });

  const { control, reset } = useForm<FormValues>({
    defaultValues: {
      startdate: "",
      enddate: "",
    },
  });

  const toggleFilter = () => {
    setIsFilterVisible((prev) => !prev);
  };

  const handleDetailClick = (id: string) => {
    
  };


  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 100 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "customer", headerName: "Customer Name", flex: 1 },
    { field: "status", headerName: "Order Status", flex: 1 },
    { field: "payment", headerName: "Total Payment", flex: 1 },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            backgroundColor: params.value === "Paid" ? "rgba(116, 213, 43, 0.2)" : "#ffd7cf",
            color: params.value === "Paid" ? "#74D52B" : "error.main", 
          }}
        />
  
      ),
    },
    {
      field: "actions",
      headerName: "Orders",
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <Button
        variant="text"
        color="primary"
        size="small"
        onClick={() => handleDetailClick(params.row.id)} // Pass the id on click
      >
        Detail
      </Button>
      ),
    },
  ];

  useEffect(() => {

    reset({
      startdate: "",
      enddate: "",

    });

  }, [reset]);

  return (
    <Box sx={{ padding: "16px", height: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginBottom: "24px",

        }}
      >
        {/* Actions Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left Section (Buttons) */}
          <Box sx={{ display: "flex", gap: "16px" }}>
            <IconButton

              color="primary"
              sx={{
                margin: "0 8px",
                padding: "6px 16px",
                borderRadius: "30px",
                backgroundColor: "#74D52B",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(116, 213, 43, 0.2)",
                "&:hover": {
                  backgroundColor: "#74D52B",
                  color: "white",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 16px rgba(116, 213, 43, 0.2)",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <Download />
            </IconButton>
            <IconButton color="primary" onClick={toggleFilter}>
              <FilterAlt sx={{ color: isFilterVisible ? "#74D52B" : "#333" }} />

            </IconButton>
            <Collapse in={isFilterVisible} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  position: "absolute",
                  backgroundColor: "#fff",
                  padding: "8px",
                  transition: "transform 0.100s ease-in-out, opacity 0.100s ease-in-out",
                  transform: isFilterVisible ? "translateX(0)" : "translateX(-100%)",
                  opacity: isFilterVisible ? 1 : 0,
                  alignItems: "center"
                }}
              >
                <Typography>Date:</Typography>
                <CentralizeDatePicker
                  name="startdate"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  sx={dateStyle}
                  disableFuture={true}
                />
                <Typography>-</Typography>
                <CentralizeDatePicker
                  name="enddate"
                  control={control}
                  defaultValue=""
                  format="DD-MM-YYYY"
                  size="small"
                  disableFuture={true}
                  sx={dateStyle}
                />
              </Box>
            </Collapse>


          </Box>

          {/* Right Section (Search Bar) */}
          <Box sx={{ flex: 1, maxWidth: "300px" }}>
            <TextField
              placeholder="Search something sweet on your mind..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#999" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",
                backgroundColor: "#fbfbe5",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    padding: "8px 12px",
                  },
                },
              }}
            />
          </Box>
        </Box>



      </Box>

      {/* DataGrid Section */}
      <Box sx={{ height: "75vh" }}>
        <DataGrid
          rows={orders}
          columns={columns}
          paginationMode="server"
          rowCount={5}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#fbfbe5", // Header background color
            },
            "& .MuiDataGrid-root .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none", // Removes focus outline
            },
          }}
        />
      </Box>
    </Box>

  );
};

export default UserHistory;
