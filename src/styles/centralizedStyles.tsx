export const gridStyles = {
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
    background: "linear-gradient(to right, rgb(253, 230, 114), rgb(253, 184, 115))",
    borderTop: "1px solid #e5e7eb",
  },
  "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus":
  {
    outline: "none",
  },
};