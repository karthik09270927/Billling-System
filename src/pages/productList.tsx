import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Card, CardContent } from "@mui/material";
import { Eye } from "lucide-react";
import { getProductList } from "../utils/api-collection"; 

interface ProductData {
  productId: number;
  productName: string;
  category: string;
  price: string;
  stock: number;
  status: string;
}

interface ProductListResponse {
  data: ProductData[];
}

const ProductListPage: React.FC = () => {
  const [rows, setRows] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    { field: "productId", headerName: "Product ID", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "productName", headerName: "Product Name", flex: 1, headerAlign: "center", align: "center" },
    { field: "category", headerName: "Category", flex: 1, headerAlign: "center", align: "center" },
    { field: "price", headerName: "Price", flex: 1, headerAlign: "center", align: "center" },
    { field: "stock", headerName: "Stock", flex: 1, headerAlign: "center", align: "center" },
    { field: "status", headerName: "Status", flex: 1, headerAlign: "center", align: "center" },
    {
      field: "viewDetails",
      headerName: "View Details",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <button
          className="text-green-500 hover:underline"
          onClick={() => handleViewDetails(params.row.id)}
        >
          <Eye className="inline-block h-5 w-5 mr-1" />
        </button>
      ),
    },
  ];

  const loadProductList = async () => {
    try {
      setLoading(true);
      const data = await getProductList('', 1, 10, 0, 0) as ProductListResponse; 
      const productsWithId = data.data.map((product) => ({
        ...product,
        id: product.productId, 
      }));
      setRows(productsWithId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching product data:', error.message);
      } else {
        console.error('Unexpected error occurred');
      }
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: number) => {
    alert(`View details for product ID: ${id}`);
  };

  useEffect(() => {
    loadProductList();
  }, []);

  return (
    <div className="p-8 flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-50 via-pink-50 to-yellow-50">
      <Card className="w-full max-w-6xl shadow-2xl rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <CardContent>
          {/* Colored Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
            <h1 className="text-4xl font-extrabold mb-4">Product List</h1>
            <p className="text-lg font-medium">Detailed overview of all products</p>
          </div>

          <div className="bg-white rounded-b-lg shadow-2xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-shadow duration-300">
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.productId}
              className="bg-gray-50"
              autoHeight
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgb(240 245 255)',
                  color: 'rgb(72 85 99)',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  borderBottom: '2px solid #e5e7eb',
                },
                '& .MuiDataGrid-cell': {
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  transition: 'background-color 0.3s',
                },
                '& .MuiDataGrid-footerContainer': {
                  backgroundColor: 'rgb(240 245 255)',
                  borderTop: '1px solid #e5e7eb',
                },
                '& .MuiDataGrid-row': {
                  transition: 'background-color 0.3s',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'rgb(234 239 255)',
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.5)',
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgb(99, 102, 241) !important',
                  color: 'white !important',
                },
                '& .MuiDataGrid-checkboxInput': {
                  color: 'rgb(99, 102, 241)',
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductListPage;
