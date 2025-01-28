import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { fetchUserList } from "../utils/api-collection";
import { Document, Page } from "react-pdf";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

interface UserData {
  orderId: number;
  userName: string;
  purchasedDate: string;
  totalAmount: string;
  phone: string;
  role: string;
  invoiceUrl: string;
}

interface UserHistoryResponse {
  data: UserData[];
}

const UserHistoryPage: React.FC = () => {
  const [rows, setRows] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedInvoiceUrl, setSelectedInvoiceUrl] = useState<string | null>(null);

  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "userName", headerName: "User Name", flex: 1, headerAlign: "center", align: "center" },
    { field: "purchasedDate", headerName: "Purchased Date", flex: 1.5, headerAlign: "center", align: "center" },
    { field: "paymentMode", headerName: "Payment Mode", flex: 1, headerAlign: "center", align: "center" },
    { field: "totalAmount", headerName: "Total Amount", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "invoice",
      headerName: "Invoice",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <button
          onClick={() => handleViewDetails(params.row.invoiceUrl)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <VisibilityOutlinedIcon
            sx={{
              color: "green",
              transition: "color 0.2s",
             
            }}
          />
        </button>
      ),
    }
  ];

  const loadUserList = async () => {
    try {
      setLoading(true);
      const data = await fetchUserList() as UserHistoryResponse;
      const usersWithId = data.data.map((user) => ({
        ...user,
        id: user.orderId,
      }));
      setRows(usersWithId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching user data:", error.message);
      } else {
        console.error("Unexpected error occurred");
      }
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (invoiceUrl: string) => {
    setSelectedInvoiceUrl(invoiceUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInvoiceUrl(null);
  };

  useEffect(() => {
    loadUserList();
  }, []);

  return (
    <div className="p-8 flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-50 via-pink-50 to-yellow-50">
      <Card className="w-full max-w-6xl shadow-2xl rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <CardContent>
          {/* Colored Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
            <h1 className="text-4xl font-extrabold mb-4">User History</h1>
            <p className="text-lg font-medium">Detailed overview of user activity</p>
          </div>

          <div className="bg-white rounded-b-lg shadow-2xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-shadow duration-300">
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.orderId}
              className="bg-gray-50"
              autoHeight
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgb(240 245 255)",
                  color: "rgb(72 85 99)",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  borderBottom: "2px solid #e5e7eb",
                },
                "& .MuiDataGrid-cell": {
                  padding: "0.75rem",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                  transition: "background-color 0.3s",
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "rgb(240 245 255)",
                  borderTop: "1px solid #e5e7eb",
                },
                "& .MuiDataGrid-row": {
                  transition: "background-color 0.3s",
                },
                "& .MuiDataGrid-row:hover": {
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          {selectedInvoiceUrl ? (
            <div className="w-full h-[500px]">
              {/* Displaying PDF in the modal */}
              <Document file={selectedInvoiceUrl}>
                <Page pageNumber={1} width={600} />
              </Document>
            </div>
          ) : (
            <p>Loading invoice...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </div>

  );
};

export default UserHistoryPage;
