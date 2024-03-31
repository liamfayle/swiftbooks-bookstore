export interface ApiBook {
  id: string;
  title: string | null;
  subtitle: string | null;
  authors: string[] | null;
  publisher: string | null;
  published_date: string | null;
  description: string | null;
  numPages: number | null;
  categories: string[] | null;
  averageStars: number | null;
  mature: "MATURE" | "NOT_MATURE" | null;
  thumbnail: string | null;
  saleability: "FOR_SALE" | "FREE" | "NOT_FOR_SALE" | "FOR_PREORDER" | null;
  price: number | null;
  sale_price: number | null;
}

export interface ApiSearchBook extends ApiBook {
  index: number;
}

export interface ApiInfoBook extends ApiBook {
  fullImage: string | null;
}

export interface ApiSearchBookInput {
  author?: string;
  field?: string;
  title?: string;
  offset?: number;
  limit?: number;
}

export interface ApiBookList {
  id: number;
  list_name: string;
  description: string | null;
  is_public: boolean;
  created_by_id: number;
  created_by_username: string;
  created_at: string;
  updated_at: string;
}

export interface ApiBookId {
  id: string;
}

export interface ApiReview {
  id: number;
  booklist_id: number;
  user_id: number;
  added_at: string;
  updated_at: string;
  content: string;
  stars: number;
  hidden: boolean;
  username: string;
}

export interface ApiReviewInput {
  list_id: number;
  stars: number;
  text_content: string;
}

export interface ApiOAuthLoginInput {
  token: string;
}

export interface ApiOAuthRegisterInput {
  username: string;
  token: string;
}

export interface ApiLoginInput {
  email: string;
  password: string;
}

export interface ApiLogin {
  message: string;
  token: string;
}

export interface ApiRegister {
  message: string;
  token: string;
}

export interface ApiRegisterInput {
  name: string;
  email: string;
  username: string;
  password: string;
}

export type ApiUserStatus = "admin" | "manager" | "user";

export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  active: boolean;
  status: ApiUserStatus;
  created_at: string;
  updated_at: string;
}

export interface ApiUserStatusInput {
  user_id: number;
  status_string: Exclude<ApiUserStatus, "admin">;
}

export interface ApiUserActiveInput {
  user_id: number;
  active: boolean;
}

export interface ApiAddCartBookInput {
  book_id: string;
  quantity: number;
}

export interface ApiRemoveCartBookInput {
  book_id: string;
}

export interface ApiCartItem {
  user_id: number;
  book_id: string;
  quantity: number;
  added_at: string;
  updated_at: string;
}

export interface ApiCheckoutInput {
  total_price: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  province: string;
  city: string;
  postal_code: string;
  cart_details: { book_id: string; quantity: number; price: number }[];
}

export interface ApiCheckout {
  order_id: number;
}

export interface ApiCreateBookListInput {
  list_name: string;
  description: string;
  is_public: boolean;
}

export interface ApiUpdateBookListInput {
  list_id: number;
  name: string;
  publicity: boolean;
  description: string;
}

export interface ApiBookListBookInput {
  list_id: number;
  book_id: string;
}

export interface ApiBookListId {
  id: number;
}
