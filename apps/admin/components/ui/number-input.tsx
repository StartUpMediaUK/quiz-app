import * as React from "react";
import { Input } from "./input";

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number | undefined) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ onValueChange, ...props }, ref) => {
    return (
      <Input
        {...props}
        ref={ref}
        type="number"
        onChange={(e) => {
          const raw = e.target.value;
          const parsed = raw === "" ? undefined : parseInt(raw, 10);
          if (onValueChange) {
            onValueChange(isNaN(parsed as number) ? undefined : parsed);
          }
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";
