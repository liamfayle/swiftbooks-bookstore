import {
  keepPreviousData,
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { DateTime } from "luxon";

import {
  ApiAddCartBookInput,
  ApiBookId,
  ApiBookList,
  ApiBookListBookInput,
  ApiBookListId,
  ApiCartItem,
  ApiCheckout,
  ApiCheckoutInput,
  ApiCreateBookListInput,
  ApiInfoBook,
  ApiLogin,
  ApiLoginInput,
  ApiOAuthLoginInput,
  ApiOAuthRegisterInput,
  ApiRegister,
  ApiRegisterInput,
  ApiRemoveCartBookInput,
  ApiReview,
  ApiReviewInput,
  ApiSearchBook,
  ApiSearchBookInput,
  ApiUpdateBookListInput,
  ApiUser,
  ApiUserActiveInput,
  ApiUserStatusInput,
} from "./types";

export const client = new QueryClient();

export class ServerError extends Error {
  name = "ServerError";
  status = 0;

  constructor(object: unknown, status: number) {
    let message = "Server error";

    if (typeof object === "object") {
      if ((object as any)?.message) {
        message = (object as any).message;
      }
    }

    super(message);
    this.status = status;
  }
}

const tokenKey = "com.swiftbooks.token";

export const getToken = () => window.localStorage.getItem(tokenKey);

export const setToken = (token: string) => window.localStorage.setItem(tokenKey, token);

export const removeToken = () => window.localStorage.removeItem(tokenKey);

const getHeaders = (): Record<string, string> => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return { Authorization: `Bearer ${token}` };
};

const HOST = process.env.NEXT_PUBLIC_API_HOST ?? "";

const doPost = <T>(input: string, { headers, ...rest }: RequestInit = {}): Promise<T> =>
  doFetch(input, { headers: { "content-type": "application/json", ...headers }, ...rest });

const doFetch = <T>(input: string, { headers, ...rest }: RequestInit = {}): Promise<T> =>
  fetch(HOST + input, { headers: { ...getHeaders(), ...headers }, ...rest }).then(async (res) => {
    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch (error) {}

      throw new ServerError(data, res.status);
    }

    return res.json();
  });

const invalidateBookListQueries = async (id?: number, reset?: boolean) => {
  await client.invalidateQueries({ queryKey: ["recentBookLists"] });
  await client.invalidateQueries({ queryKey: ["publicBookLists"] });
  await client.invalidateQueries({ queryKey: ["userBookLists"] });
  if (id != null) {
    reset
      ? await client.resetQueries({ queryKey: ["bookList", id] })
      : await client.invalidateQueries({ queryKey: ["bookList", id] });
    reset
      ? await client.resetQueries({ queryKey: ["bookListBookIds", id] })
      : await client.invalidateQueries({ queryKey: ["bookListBookIds", id] });
  }
};

export const useCreateBookListMutation = () =>
  useMutation({
    mutationFn: (input: ApiCreateBookListInput) =>
      doPost<ApiBookListId>("/api/secure/create-booklist", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateBookListQueries(),
  });

export const useUpdateBookListMutation = () =>
  useMutation({
    mutationFn: (input: ApiUpdateBookListInput) =>
      doPost<void>("/api/secure/update-booklist", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, input) => invalidateBookListQueries(input.list_id),
  });

export const useRemoveBookListMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      doPost<void>("/api/secure/delete-user-booklist", {
        method: "DELETE",
        body: JSON.stringify({ list_id: id }),
      }),
    onSuccess: (_data, input) => invalidateBookListQueries(input, true),
  });

export const useAddBookListBookMutation = () =>
  useMutation({
    mutationFn: (input: ApiBookListBookInput) =>
      doPost<void>("/api/secure/add-book-to-list", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, input) => invalidateBookListQueries(input.list_id),
  });

export const useRemoveBookListBookMutation = () =>
  useMutation({
    mutationFn: (input: ApiBookListBookInput) =>
      doPost<void>("/api/secure/delete-book-from-list", {
        method: "DELETE",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, input) => invalidateBookListQueries(input.list_id),
  });

const invalidateAuthQueries = async () => {
  await client.resetQueries({ queryKey: ["currentUser"] });
  await client.resetQueries({ queryKey: ["cart"] });
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (input: ApiLoginInput) =>
      doPost<ApiLogin>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAuthQueries(),
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (input: ApiRegisterInput) =>
      doPost<ApiRegister>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAuthQueries(),
  });

export const useOAuthLoginMutation = () =>
  useMutation({
    mutationFn: (input: ApiOAuthLoginInput) =>
      doPost<ApiLogin>("/api/auth/oauth-login", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAuthQueries(),
  });

export const useOAuthRegisterMutation = () =>
  useMutation({
    mutationFn: (input: ApiOAuthRegisterInput) =>
      doPost<ApiRegister>("/api/auth/oauth-register", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => invalidateAuthQueries(),
  });

export const useAddReviewMutation = () =>
  useMutation({
    mutationFn: (input: ApiReviewInput) =>
      doPost<void>("/api/secure/add-review", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async (_data, input) => {
      await client.invalidateQueries({ queryKey: ["bookListReviews", input.list_id] });
    },
  });

export const useToggleReviewMutation = () =>
  useMutation({
    mutationFn: (id: number) =>
      doPost<void>("/api/secure/toggle-hide-review", {
        method: "PUT",
        body: JSON.stringify({ review_id: id }),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["bookListReviews"] });
    },
  });

export const useRemoveCartBookMutation = () =>
  useMutation({
    mutationFn: (input: ApiRemoveCartBookInput) =>
      doPost<ApiRegister>("/api/secure/delete-book-from-cart", {
        method: "DELETE",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["cart"] });
    },
  });

export const useAddCartBookMutation = () =>
  useMutation({
    mutationFn: (input: ApiAddCartBookInput) =>
      doPost<ApiRegister>("/api/secure/add-book-to-cart", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["cart"] });
    },
  });

export const useCheckoutMutation = () =>
  useMutation({
    mutationKey: ["checkout"],
    mutationFn: (input: ApiCheckoutInput) =>
      doPost<ApiCheckout>("/api/secure/checkout", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["cart"] });
    },
  });

export const useCart = (enabled?: boolean) =>
  useQuery<ApiCartItem[]>({
    retry: false,
    enabled,
    queryKey: ["cart"],
    queryFn: () => doFetch(`/api/secure/get-cart`),
  });

export const useCartBooks = (
  enabled?: boolean,
): { data: undefined; isSuccess: false } | { data: ApiInfoBook[]; isSuccess: true } => {
  const { data: cartItems } = useCart(enabled);
  const responses = useQueries({
    queries:
      enabled !== false
        ? cartItems
          ? cartItems.map(({ book_id }) => getBookQueryOptions(book_id))
          : []
        : [],
  });

  if (!cartItems || responses.some((response) => !response.data)) {
    return { data: undefined, isSuccess: false };
  }

  return {
    data: responses.map((response) => response.data!),
    isSuccess: true,
  };
};

export const useCartTotal = (enabled?: boolean): { data: number | undefined } => {
  const { data: cartItems } = useCart(enabled);
  const { data: books } = useCartBooks(enabled);

  if (!books || !cartItems) {
    return { data: undefined };
  }

  const total =
    books
      ?.filter((book) => book.price != null)
      .reduce(
        (acc, book) =>
          acc +
          (book.price ?? 0) * (cartItems?.find((item) => item.book_id === book.id)?.quantity ?? 0),
        0,
      ) || 0;

  return { data: total };
};

export const useUserStatusMutation = () =>
  useMutation({
    mutationFn: (input: ApiUserStatusInput) =>
      doPost<void>("/api/admin/change-user-status", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["users"] });
    },
  });

export const useUserActiveMutation = () =>
  useMutation({
    mutationFn: (input: ApiUserActiveInput) =>
      doPost<void>("/api/admin/change-user-active", {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["users"] });
    },
  });

export const useUsers = () =>
  useQuery<ApiUser[]>({
    retry: false,
    queryKey: ["users"],
    queryFn: () => doFetch(`/api/admin/get-users`),
  });

export const useCurrentUser = (enabled?: boolean) =>
  useQuery<ApiUser>({
    retry: false,
    queryKey: ["currentUser"],
    queryFn: () => doFetch(`/api/secure/get-user-details`),
    enabled,
  });

export const useBookListReviews = (id: number) =>
  useQuery<ApiReview[]>({
    retry: false,
    queryKey: ["bookListReviews", id],
    queryFn: () =>
      doFetch<ApiReview[]>(`/api/open/get-reviews-for-list?list_id=${id}`).then((data) =>
        data.sort((a, b) => compareDates(a.added_at, b.added_at)),
      ),
  });

export const useBooks = (
  bookIds: string[],
  keepPreviousData?: boolean,
): { data: ApiInfoBook[] | undefined; isSuccess: boolean; isLoading: boolean } => {
  const responses = useQueries({
    queries: bookIds.map((id) => getBookQueryOptions(id)),
  });

  const isLoading = responses.some((response) => response.isLoading);
  const isSuccess = responses.every((response) => response.isSuccess);

  if (!bookIds || (!keepPreviousData && !isSuccess)) {
    return { data: undefined, isSuccess, isLoading };
  }

  return {
    data: keepPreviousData
      ? responses.filter((response) => response.isSuccess).map((response) => response.data!)
      : responses.map((response) => response.data!),
    isSuccess: responses.every((response) => response.isSuccess),
    isLoading,
  };
};

export const useBookListBooks = (id: number): { data: ApiInfoBook[] | undefined } => {
  const { data: bookIds } = useBookListBookIds(id);
  return useBooks(bookIds ? bookIds.map(({ id }) => id) : []);
};

export const useBookList = (id: number, enabled?: boolean) =>
  useQuery<ApiBookList>({
    enabled,
    retry: false,
    queryKey: ["bookList", id],
    queryFn: () => doFetch(`/api/open/booklist-info-from-id?list_id=${id}`),
  });

export const useBookListBookIds = (id: number, enabled?: boolean) =>
  useQuery<ApiBookId[]>({
    enabled,
    retry: false,
    queryKey: ["bookListBookIds", id],
    queryFn: () => doFetch(`/api/open/list-book-ids?list_id=${id}`),
  });

export const useBookListPageCount = (id: number): { data: number | undefined } => {
  const { data: books } = useBookListBooks(id);

  if (!books) {
    return { data: undefined };
  }

  const pages = books.reduce((acc, book) => (book.numPages || 0) + acc, 0);

  return { data: pages };
};

export const useUserBookLists = (enabled?: boolean) =>
  useQuery<ApiBookList[]>({
    retry: false,
    enabled,
    queryKey: ["userBookLists"],
    queryFn: () =>
      doFetch<ApiBookList[]>("/api/secure/get-user-booklists").then((data) =>
        data.sort((a, b) => compareDates(a.updated_at, b.updated_at)),
      ),
  });

const compareDates = (a: string, b: string) =>
  DateTime.fromISO(b).toMillis() - DateTime.fromISO(a).toMillis();

export const useRecentBookLists = (enabled?: boolean) =>
  useQuery<ApiBookList[]>({
    retry: false,
    enabled,
    queryKey: ["recentBookLists"],
    queryFn: () => doFetch("/api/open/recent-public-booklists"),
  });

export const usePublicBookLists = (enabled?: boolean) =>
  useQuery<ApiBookList[]>({
    retry: false,
    enabled,
    queryKey: ["publicBookLists"],
    queryFn: () => doFetch("/api/secure/get-public-booklists"),
  });

const getBookQueryOptions = (id: string) =>
  ({
    retry: false,
    queryKey: ["book", id],
    queryFn: () => doFetch<ApiInfoBook>(`/api/open/book-info-from-id?id=${id}`),
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
  }) as const;

export const useBook = (id: string) => useQuery<ApiInfoBook>(getBookQueryOptions(id));

export const useBookSearch = ({ title, author, field, limit }: ApiSearchBookInput) =>
  useQuery<ApiSearchBook[]>({
    retry: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    placeholderData: keepPreviousData,
    queryKey: ["bookSearch", title, author, field, limit],
    queryFn: () => {
      const params = new URLSearchParams();

      if (title) {
        params.set("title", title);
      }

      if (author) {
        params.set("author", author);
      }

      if (field) {
        params.set("field", field);
      }

      if (limit) {
        params.set("limit", String(limit));
      }

      const query = params.toString();

      return doFetch(`/api/open/search?${query}`);
    },
  });
