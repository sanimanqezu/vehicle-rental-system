"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormValues } from "@/schemas";
import { User } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface UserFormProps {
  defaultValues?: User;
  onSubmit: (data: UserFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ defaultValues, onSubmit, onCancel, isLoading }: UserFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues
      ? { ...defaultValues, password: "" }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="First Name" {...register("firstName")} placeholder="John" error={errors.firstName?.message} />
        <Input label="Last Name" {...register("lastName")} placeholder="Doe" error={errors.lastName?.message} />
      </div>

      <Input label="Username" {...register("username")} placeholder="johndoe" error={errors.username?.message} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Date of Birth" {...register("dateOfBirth")} type="date" error={errors.dateOfBirth?.message} />
        <Input label="RSA ID Number" {...register("rsaId")} placeholder="13 digits" maxLength={13} error={errors.rsaId?.message} />
      </div>

      <Input
        label={defaultValues ? "New Password (leave blank to keep)" : "Password"}
        {...register("password")}
        type="password"
        placeholder="Minimum 8 characters"
        error={errors.password?.message}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  );
}
