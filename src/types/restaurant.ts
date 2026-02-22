export type UserRole =
  | "super_admin"
  | "manager"
  | "staff"
  | "kitchen"
  | "guest_session";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "completed"
  | "cancelled";

export type OrderSessionStatus = "active" | "closed";

export const STAFF_ROLES: UserRole[] = [
  "super_admin",
  "manager",
  "staff",
  "kitchen",
];

export const MANAGER_ROLES: UserRole[] = ["super_admin", "manager"];

export const KITCHEN_ROLES: UserRole[] = ["super_admin", "manager", "kitchen"];

export function isStaff(role: UserRole | null): boolean {
  return role !== null && STAFF_ROLES.includes(role);
}

export function isManager(role: UserRole | null): boolean {
  return role !== null && MANAGER_ROLES.includes(role);
}

export function canAccessKitchen(role: UserRole | null): boolean {
  return role !== null && KITCHEN_ROLES.includes(role);
}
