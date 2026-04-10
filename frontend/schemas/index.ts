import { z } from "zod";

export const carSchema = z.object({
  vin: z.string().min(1, "VIN is required").max(17, "VIN must be 17 characters or less"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  engine: z.string().min(1, "Engine is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  mileage: z.coerce.number().int().min(0, "Mileage must be 0 or more"),
  price: z.coerce.number().min(0, "Price must be positive"),
  ownerId: z.coerce.number().int().min(0),
  features: z.array(z.string()).default([]),
});

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  rsaId: z.string().length(13, "RSA ID must be exactly 13 digits").regex(/^\d+$/, "RSA ID must contain only digits"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
});

export const reservationSchema = z
  .object({
    userId: z.coerce.number().int().min(1, "User ID is required"),
    carId: z.string().min(1, "Car VIN is required"),
    fromDate: z.string().min(1, "Start date is required"),
    toDate: z.string().min(1, "End date is required"),
    pickUpLocation: z.string().min(1, "Pick-up location is required"),
    dropOffLocation: z.string().min(1, "Drop-off location is required"),
  })
  .refine((data) => new Date(data.toDate) > new Date(data.fromDate), {
    message: "End date must be after start date",
    path: ["toDate"],
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  rsaId: z.string().length(13, "RSA ID must be exactly 13 digits"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type CarFormValues = z.infer<typeof carSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
