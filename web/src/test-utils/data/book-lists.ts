import { ApiBookList } from "@/api/types";

export const bookLists: ApiBookList[] = [
  {
    id: 1,
    list_name: "List 1",
    description: "Desc 1",
    is_public: true,
    created_at: "2023-11-26T05:53:33.233Z",
    created_by_id: 1,
    created_by_username: "admin",
    updated_at: "2023-11-26T05:53:33.233Z",
  },
  {
    id: 2,
    list_name: "List 2",
    description: "Desc 2",
    is_public: true,
    created_at: "2023-11-26T05:53:33.233Z",
    created_by_id: 2,
    created_by_username: "bob",
    updated_at: "2023-11-26T05:53:33.233Z",
  },
  {
    id: 3,
    list_name: "List 3",
    description: "Desc 3",
    is_public: true,
    created_at: "2023-11-26T05:53:33.233Z",
    created_by_id: 2,
    created_by_username: "bob",
    updated_at: "2023-11-26T05:53:33.233Z",
  },
];
