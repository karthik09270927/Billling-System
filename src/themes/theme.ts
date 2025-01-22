import { createTheme } from '@mui/material/styles';


declare module '@mui/material/styles' {
  interface Components {
    Box: {
      styleOverrides: {
        root: {
          backgroundColor: any;
          color: string;
          boxShadow: string;
          borderRadius: string;
          border: string;
        };
      };
    };
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    divider: '#e0e0e0',
    background: {
      default: '#ffffff',
      paper: '#fbfbe5',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          // boxShadow: '4px 4px 6px 6px rgba(0, 0, 0, 0.1)',
          // borderRadius: '30px',
        },
      },
    },
    Box : {
      styleOverrides: {
        root: {
          backgroundColor: '#fbfbe5',
          color: '#000000',
          boxShadow: '4px 4px 6px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '30px',
          border:''
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          color: '#000000',
        },
      },
    },
    
    MuiButton: {
      styleOverrides: {
        root: {

        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#74D52B',
          color: '#ffffff',
          
        },
      },
    },
    // MuiToolbar: {
    //   styleOverrides: {
    //     root: {
    //       background: 'linear-gradient(90deg, #1c3e35 0%, #f0f9a7 100%)',
    //       color: '#ffffff',
    //     },
    //   },
    // },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1c3e35 0%, #f0f9a7 100%)',
          fontColor: '#ffffff',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#f48fb1',
    },
    error: {
      main: '#ef5350',
    },
    divider: '#424242',
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d',
          color: '#ffffff',
          // border: '5px solid #ffffff',
          // borderRadius: '30px',
        },
      },
    },
    Box : {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d',
          color: '#000000',
          boxShadow: '4px 4px 6px 6px rgb(241, 241, 241)',
          borderRadius: '30px',
          border:''

        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          color: '#000000',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {

        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#1d1d1d',
          color: '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          color: '#ffffff',
        },
      },
    },
    // MuiToolbar: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#333333',
    //       color: '#ffffff',
    //     },
    //   },
    // },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
        },
      },
    },
  },
});