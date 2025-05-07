export interface BookType {
  createdAt?: Date | string;
  updatedAt?: Date | string;
  id?: number;
  libraryId?: string;
  barcode?: string;
  rentalStatus: RentalStatus;
  rentedDate: Date | string;
  dueDate?: Date | string;
  renewalCount: number;
  title: string;
  subtitle?: string;
  author: string;
  topics?: string;
  imageLink?: string;
  isbn?: string;
  editionDescription?: string;
  publisherLocation?: string;
  pages?: number;
  summary?: string;
  publisherName?: string;
  otherPhysicalAttributes?: string;
  supplierComment?: string;
  publisherDate?: string;
  physicalSize?: string;
  minAge?: string;
  maxAge?: string;
  additionalMaterial?: string;
  price?: string;
  externalLinks?: string;
  userId?: number;
  user?: { firstName?: string; lastName?: string };
}

export type Rental = {
  title: string;
  author: string;
  id: number;
  user: {
    id: number;
    lastName: string;
    firstName: string;
  } | null;
  dueDate: string | null;
  renewalCount: number;
};

export type RentalStatus =
  | 'available'
  | 'rented'
  | 'broken'
  | 'presentation'
  | 'ordered'
  | 'lost'
  | 'remote';
