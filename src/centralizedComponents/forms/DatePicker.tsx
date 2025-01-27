import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

interface CentralizeDatePickerProps {
  name: string;
  control: any;
  defaultValue: any;
  sx?: object;
  format?: "MM-YYYY" | "DD-MM-YYYY";
  readonly?: boolean;
  size?: "small" | "medium";
  disableFuture?: boolean
  iconColor?: string;
  fullwidth?: boolean;
  label?: string;
}


const CentralizeDatePicker: React.FC<CentralizeDatePickerProps> = ({
  name,
  control,
  defaultValue,
  sx = {},
  format =  "DD-MM-YYYY",
  readonly = false,
  // size = "medium",
  disableFuture = false,
  iconColor = "#bfbf7c",
  fullwidth = true,
  label,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { value, onChange } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...props}
            views={format === "DD-MM-YYYY" ? ["year", "month", "day"] : undefined}
            format={format}
           
            disableFuture={disableFuture}
            value={value ? dayjs(value, format) : null}
            onChange={(newValue) => {
              if (newValue) {
                const formattedDate = dayjs(newValue).format(format);
                onChange(formattedDate);
              } else {
                onChange(null);
              }
            }}
            readOnly={readonly}
           slotProps={{
            textField: {
              sx: {
                ...sx,
                width: fullwidth ? "100%" : "auto", // Make sure TextField is full width
              },
              label: label
              // size,
            },
           openPickerButton: {
            sx: {
              color: iconColor, // Set the icon color here
            },
          },
        }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default CentralizeDatePicker;
