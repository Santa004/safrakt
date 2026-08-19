import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Ange namn"),
  species: z.enum(["hund", "katt", "ovrigt"]),
  breed: z.string().optional(),
  birth_date: z.string().optional(),
  notes: z.string().optional(),
});

export const vaccinationSchema = z.object({
  pet_id: z.string().uuid(),
  vaccine_name: z.string().min(1),
  given_on: z.string().optional(),
  due_on: z.string().min(1),
});

export const bookingSchema = z.object({
  pet_id: z.string().uuid(),
  type_id: z.string().uuid(),
  starts_at: z.string().min(1),
});

export const profileSchema = z.object({
  full_name: z.string().min(1),
  phone: z.string().optional(),
});
