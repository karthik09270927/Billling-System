import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Function to create product data
function createProduct(
  category: string,
  subcategory: string,
  name: string,
  price: number,
  stock: number,
  details: { brand: string; description: string }[]
) {
  return { category, subcategory, name, price, stock, details };
}

// Row component for each product
function Row(props: { row: ReturnType<typeof createProduct> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { backgroundColor: '#f7f7f7' },
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              transition: 'transform 0.3s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        <TableCell>{row.category}</TableCell>
        <TableCell>{row.subcategory}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right">${row.price.toFixed(2)}</TableCell>
        <TableCell align="right">{row.stock}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, padding: 1, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>{detail.brand}</TableCell>
                      <TableCell>{detail.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// Sample product data
const products = [
  createProduct('Beverages', 'Soft Drinks', 'Coca Cola', 1.5, 200, [
    { brand: 'Coca Cola', description: '500ml Bottle' },
    { brand: 'Coca Cola', description: 'Available in packs of 6' },
  ]),
  createProduct('Beverages', 'Juices', 'Orange Juice', 2.5, 150, [
    { brand: 'Tropicana', description: '1L Carton' },
    { brand: 'Tropicana', description: 'No added sugar' },
  ]),
  createProduct('Snacks', 'Chips', 'Potato Chips', 1.2, 300, [
    { brand: 'Lays', description: 'Classic Salted' },
    { brand: 'Lays', description: 'Available in 150g packs' },
  ]),
  createProduct('Dairy', 'Milk', 'Full Cream Milk', 1.0, 100, [
    { brand: 'Amul', description: '500ml Pouch' },
    { brand: 'Amul', description: 'Rich and creamy texture' },
  ]),
];

export default function HypermarketTable() {
  return (
    
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 600,
        boxShadow: 3,
        borderRadius: 3,
        mt: 5
      }}
    >
      <Table
        stickyHeader
        aria-label="hypermarket product table"
        sx={{
          '& .MuiTableCell-head': {
            backgroundColor: '#fbfbe5',
            color: '#000',
            fontWeight: 'bold',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Category</TableCell>
            <TableCell>Subcategory</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Price ($)</TableCell>
            <TableCell align="right">Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <Row key={index} row={product} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
