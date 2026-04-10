export interface Car {
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engine: string;
  transmission: string;
  fuelType: string;
  mileage: number;
  price: number;
  ownerId: number;
  features: string[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  rsaId: string;
  username: string;
  password?: string;
}

export interface Reservation {
  id: number;
  userId: number;
  carId: string;
  fromDate: string;
  toDate: string;
  pickUpLocation: string;
  dropOffLocation: string;
}

export interface DashboardStats {
  totalCars: number;
  totalUsers: number;
  totalReservations: number;
  activeReservations: number;
}

export interface NotificationEvent {
  type: 'RESERVATION_CREATED' | 'RESERVATION_UPDATED' | 'RESERVATION_DELETED';
  reservationId: number;
  message: string;
  timestamp: string;
}

export type ThemeMode = 'dark' | 'light';

export interface SearchCarsParams {
  make?: string;
  model?: string;
  price?: number;
  color?: string;
}

export interface SearchReservationsParams {
  userId?: number;
  carId?: string;
  fromDate?: string;
  toDate?: string;
  pickUpLocation?: string;
  dropOffLocation?: string;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
}
