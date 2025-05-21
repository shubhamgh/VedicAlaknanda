
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { validateMinLength, validateEmail } from "@/utils/validationUtils";

export interface FormValues {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  address: string;
  gov_id_number: string;
}

const PersonalInfoForm: React.FC = () => {
  const form = useFormContext<FormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="guest_name"
        rules={{ 
          required: "Name is required",
          validate: (value) => validateMinLength(value, 2, "Name") 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="guest_email"
        rules={{ 
          required: "Email is required",
          validate: validateEmail 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Email address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="guest_phone"
        rules={{ 
          required: "Phone number is required",
          validate: (value) => validateMinLength(value, 5, "Phone number") 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        rules={{ 
          required: "Address is required",
          validate: (value) => validateMinLength(value, 5, "Address") 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gov_id_number"
        rules={{ 
          required: "Government ID number is required",
          validate: (value) => validateMinLength(value, 5, "Government ID number") 
        }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Government ID Number</FormLabel>
            <FormControl>
              <Input placeholder="ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoForm;
