"use client";

import { Modal, ConfirmModal } from "@/components/ui/Modal";
import { CarForm } from "@/components/cars/CarForm";
import { Car } from "@/types";
import { CarFormValues } from "@/schemas";

interface CarModalProps {
  mode: "create" | "edit" | "delete" | null;
  car?: Car | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function CarModal({ mode, car, isLoading, onClose, onSubmit, onDelete }: CarModalProps) {
  if (!mode) return null;

  if (mode === "delete") {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onDelete}
        title="Remove Vehicle"
        message={`Remove ${car?.make} ${car?.model} (VIN: ${car?.vin}) from the fleet? This action cannot be undone.`}
        confirmLabel="Remove Vehicle"
        isLoading={isLoading}
      />
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={mode === "create" ? "Add Vehicle" : "Edit Vehicle"}
      description={mode === "create" ? "Register a new vehicle in the fleet" : `Editing ${car?.make} ${car?.model}`}
      size="lg"
    >
      <CarForm
        defaultValues={car ?? undefined}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
