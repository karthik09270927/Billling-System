// import React from 'react';
// import { TextField, Grid } from '@mui/material';

// interface InputOTPProps {
//   value: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   maxLength: number;
// }

// const InputOTP: React.FC<InputOTPProps> = ({ value, onChange, maxLength }) => {
//   // Create an array of empty values based on the max length of OTP
//   const otpArray = Array.from({ length: maxLength });

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const newValue = event.target.value;
//     if (/[^0-9]/.test(newValue)) return; // Allow only digits

//     const newOtp = value.split('');
//     newOtp[index] = newValue;
//     onChange({ target: { value: newOtp.join('') } } as React.ChangeEvent<HTMLInputElement>);
//   };

//   return (
//     <Grid container spacing={1} justifyContent="center">
//       {otpArray.map((_, index) => (
//         <Grid item key={index}>
//           <TextField
//             value={value[index] || ''}
//             onChange={(e) => handleChange(e, index)}
//             inputProps={{ maxLength: 1 }}
//             sx={{ width: '40px', textAlign: 'center' }}
//             variant="outlined"
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default InputOTP;
