export enum UserRole {
  ADMIN = "admin",
  OWNER = "owner",
  LEADER = "leader",
  USER = "user",
}

export interface User {
  active: boolean;
  role: UserRole;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  postCode: string | null;
  street: string;
  houseNumber: string;
  phoneNumber: string;
  carId: string | null;
  routeId: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  lastLogin: string | null;
  invitationToken: string | null;
  invitationExpires: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  paidPerStop: string;
  car?: Car | null;
  route?: Route | null;
}

export interface Route {
  id: string;
  name: string;
  assignedUserId: string | null;
  description: string;
  regionId: string | null;
  region?: Region | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  active: boolean;
  assignedUser?: User | null;
  updatedByUser?: User;
}

export enum CarOwner {
  PARENT_COMPANY = "parent_company",
  OWN_COMPANY = "own_company",
}

export enum CarStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  IN_REPAIR = "in_repair",
  OUT_OF_SERVICE = "out_of_service",
  RENTED = "rented",
}

export interface Car {
  id: string;
  name: string;
  licensePlate: string;
  assignedUserId: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  active: boolean;
  assignedUser?: User;
  updatedByUser?: User;
  owner: CarOwner;
  status: CarStatus;
  checkupDate: string;
  oilChangeDate: string;
  tiresChangeDate: string;
  brakesChangeDate: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface SignupData {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  city: string;
  postCode: string;
  street: string;
  houseNumber: string;
  phoneNumber: string;
}

export interface TokenResponse {
  access_token: string;
  user: User;
}

export interface WorkEntry {
  id: string;
  userId: string;
  routeId: string | null;
  carId: string | null;
  stopsCompleted: number;
  workDate: string;
  createdAt: string;
  updatedAt: string;
  route?: Route;
  car?: Car;
  user?: User;
  totalRevenue: number;
  driverPay: number;
  companyProfit: number;
}

export interface CreateWorkEntryData {
  stopsCompleted: number;
  workDate: string;
  routeId?: string;
  carId?: string;
}

export interface WorkEntriesFilters {
  userId?: string;
  routeId?: string;
  carId?: string;
  regionId?: string;
  startDate?: string;
  endDate?: string;
  month?: string;
}

export interface File {
  id: string;
  name: string;
  originalName: string;
  type: "image" | "pdf";
  size: number;
  createdAt: string;
  url: string;
}

export interface Region {
  id: string;
  name: string;
  description?: string;
  leaderId?: string;
  leader?: User;
  routes?: Route[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  updatedByUser?: User;
}

export interface RoutesList {
  id: number;
  route: string;
  number_of_stops: number;
  number_of_packages: number;
  date: Date;
}

export interface Event {
  id: string;
  description: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  userId: string;
  user?: User;
}

export interface Complaint {
  id: string;
  description: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  userId: string;
  user?: User;
}

export enum ComplaintStatus {
  EMPTY = "",
  APPROVED = "approved",
  REJECTED = "rejected",
  IN_PROGRESS = "inProgress",
}

export interface Complaint {
  id: string;
  complaint_number: number;
  client: string;
  description: string;
  problem_type: string;
  compensation_value: number | null;
  courier: string;
  address: string;
  delivery_date: string; // ISO date string
  comments: string | null;
  userId: string;
  status: ComplaintStatus;
  user?: User; // Optional because it's a relation that might not always be loaded
}
