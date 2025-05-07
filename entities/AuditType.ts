export interface AuditType {
  createdAt?: string;
  updatedAt?: string;
  id?: number;
  eventType: Event;
  eventContent: string;
  bookid: number;
  userid: number;
}

export enum Event {
  ADD_BOOK = 'ADD_BOOK',
  UPDATE_BOOK = 'UPDATE_BOOK',
  DELETE_BOOK = 'DELETE_BOOK',
  EXTEND_BOOK = 'EXTEND_BOOK',
  RETURN_BOOK = 'RETURN_BOOK',
  RENT_BOOK = 'RENT_BOOK',
  ADD_USER = 'ADD_USER',
  UPDATE_USER = 'UPDATE_USER',
  DISABLE_USER = 'DISABLE_USER',
  ENABLE_USER = 'ENABLE_USER',
  DELETE_USER = 'DELETE_USER',
}
