
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const PricePerNightForm = () => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pricing</h3>
      
      <FormField
        control={control}
        name="price_per_night"
        rules={{
          required: "Price per night is required",
          min: { value: 1, message: "Price must be greater than 0" },
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price per Night (₹)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter price per night"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PricePerNightForm;
