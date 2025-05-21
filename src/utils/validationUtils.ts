
export const validateRequired = (value: any) => {
  return value ? true : "This field is required";
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? true : "Invalid email address";
};

export const validateMinLength = (value: string, minLength: number, fieldName: string) => {
  return value.length >= minLength ? true : `${fieldName} must be at least ${minLength} characters`;
};

export const calculateNights = (checkIn: Date, checkOut: Date) => {
  const diffInTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffInTime / (1000 * 3600 * 24));
};
