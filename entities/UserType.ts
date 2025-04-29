export interface UserType {
  createdAt?: string;
  updatedAt?: string;
  id?: number;
  lastName: string;
  firstName: string;
  phone: string;
  active: boolean;
  eMail?: string | null;
}
