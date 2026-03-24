/** Generic async state wrapper */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Toast notification levels */
export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

/** In-app notification */
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  variant: ToastVariant;
  read: boolean;
  createdAt: string;
}

/** Generic option for select/radio fields */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
