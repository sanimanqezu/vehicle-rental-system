"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, ReservationFormValues } from "@/schemas";
import { Reservation, Car, User } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ReservationFormProps {
  defaultValues?: Reservation;
  cars: Car[];
  users: User[];
  onSubmit: (data: ReservationFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReservationForm({ defaultValues, cars, users, onSubmit, onCancel, isLoading }: ReservationFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: defaultValues
      ? {
          userId: defaultValues.userId,
          carId: defaultValues.carId,
          fromDate: defaultValues.fromDate?.split("T")[0],
          toDate: defaultValues.toDate?.split("T")[0],
          pickUpLocation: defaultValues.pickUpLocation,
          dropOffLocation: defaultValues.dropOffLocation,
        }
      : undefined,
  });

  const selectClass = "w-full h-9 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all";
  const labelClass = "text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className={labelClass}>Client</label>
        <select {...register("userId", { valueAsNumber: true })} className={selectClass}>
          <option value="">Select a client</option>
          {users.map((u) => (
            <option key={u.id} value={u.id} className="bg-[var(--color-surface)]">
              {u.firstName} {u.lastName} (@{u.username})
            </option>
          ))}
        </select>
        {errors.userId && <p className="text-xs text-[var(--color-error)]">{errors.userId.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Vehicle</label>
        <select {...register("carId")} className={selectClass}>
          <option value="">Select a vehicle</option>
          {cars.map((c) => (
            <option key={c.vin} value={c.vin} className="bg-[var(--color-surface)]">
              {c.make} {c.model} ({c.year}) — {c.vin}
            </option>
          ))}
        </select>
        {errors.carId && <p className="text-xs text-[var(--color-error)]">{errors.carId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="From Date" {...register("fromDate")} type="date" error={errors.fromDate?.message} />
        <Input label="To Date" {...register("toDate")} type="date" error={errors.toDate?.message} />
      </div>

      <Input label="Pick-up Location" {...register("pickUpLocation")} placeholder="e.g. OR Tambo International Airport" error={errors.pickUpLocation?.message} />
      <Input label="Drop-off Location" {...register("dropOffLocation")} placeholder="e.g. Cape Town CBD" error={errors.dropOffLocation?.message} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? "Update Reservation" : "Create Reservation"}
        </Button>
      </div>
    </form>
  );
}
