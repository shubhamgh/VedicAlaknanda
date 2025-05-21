
import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export interface RequestsFormValues {
  special_requests: string;
}

const SpecialRequestsForm: React.FC = () => {
  const form = useFormContext<RequestsFormValues>();

  return (
    <FormField
      control={form.control}
      name="special_requests"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Special Requests</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Any special requirements or requests"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SpecialRequestsForm;
