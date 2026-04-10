"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { carSchema, CarFormValues } from "@/schemas";
import { Car } from "@/types";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { X, Plus } from "lucide-react";

interface CarFormProps {
  defaultValues?: Car;
  onSubmit: (data: CarFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const transmissionOptions = [
  { value: "AUTOMATIC", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
  { value: "CVT", label: "CVT" },
  { value: "SEMI_AUTOMATIC", label: "Semi-Automatic" },
];

const fuelOptions = [
  { value: "PETROL", label: "Petrol" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
];

export function CarForm({ defaultValues, onSubmit, onCancel, isLoading }: CarFormProps) {
  const [features, setFeatures] = useState<string[]>(defaultValues?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: defaultValues
      ? { ...defaultValues }
      : { mileage: 0, price: 0, ownerId: 0, features: [], year: new Date().getFullYear() },
  });

  useEffect(() => {
    setValue("features", features);
  }, [features, setValue]);

  const addFeature = () => {
    const f = featureInput.trim();
    if (f && !features.includes(f)) {
      setFeatures((prev) => [...prev, f]);
      setFeatureInput("");
    }
  };

  const removeFeature = (f: string) => setFeatures((prev) => prev.filter((x) => x !== f));

  const handleFormSubmit = (data: CarFormValues) => {
    return onSubmit({ ...data, features });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="VIN"
          {...register("vin")}
          placeholder="e.g. 1HGBH41JXMN109186"
          error={errors.vin?.message}
          disabled={!!defaultValues}
        />
        <Input label="Make" {...register("make")} placeholder="e.g. Toyota" error={errors.make?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Model" {...register("model")} placeholder="e.g. Camry" error={errors.model?.message} />
        <Input label="Year" {...register("year", { valueAsNumber: true })} type="number" placeholder="2024" error={errors.year?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Color" {...register("color")} placeholder="e.g. Pearl White" error={errors.color?.message} />
        <Input label="Engine" {...register("engine")} placeholder="e.g. 2.5L V6" error={errors.engine?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Transmission" {...register("transmission")} options={transmissionOptions} error={errors.transmission?.message} />
        <Select label="Fuel Type" {...register("fuelType")} options={fuelOptions} error={errors.fuelType?.message} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Mileage (km)" {...register("mileage", { valueAsNumber: true })} type="number" placeholder="0" error={errors.mileage?.message} />
        <Input label="Price (ZAR)" {...register("price", { valueAsNumber: true })} type="number" placeholder="0" error={errors.price?.message} />
        <Input label="Owner ID" {...register("ownerId", { valueAsNumber: true })} type="number" placeholder="0" error={errors.ownerId?.message} />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Features</label>
        <div className="flex gap-2">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
            placeholder="e.g. Sunroof, heated seats..."
            className="flex-1 h-9 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addFeature} leftIcon={<Plus size={13} />}>
            Add
          </Button>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.map((f) => (
              <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                {f}
                <button type="button" onClick={() => removeFeature(f)} className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>
          {defaultValues ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </div>
    </form>
  );
}
