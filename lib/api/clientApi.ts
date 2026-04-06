import type { Note, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

type Credentials = {
  email: string;
  password: string;
};

type UpdateProfilePayload = {
  username: string;
};

type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

type SessionResponse = {
  success: boolean;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
  response?: {
    message?: string;
  };
};

export function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const maybeResponse = error as {
      response?: {
        data?: ApiErrorResponse;
      };
      message?: string;
    };

    return (
      maybeResponse.response?.data?.response?.message ??
      maybeResponse.response?.data?.message ??
      maybeResponse.response?.data?.error ??
      maybeResponse.message ??
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function fetchNotes(params: FetchNotesParams = {}) {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      perPage: 12,
      ...params,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(
  payload: Pick<Note, "title" | "content" | "tag">,
) {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string) {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function register(payload: Credentials) {
  const response = await api.post<User>("/auth/register", payload);
  return response.data;
}

export async function login(payload: Credentials) {
  const response = await api.post<User>("/auth/login", payload);
  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const response = await api.get<SessionResponse>("/auth/session");
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function updateMe(payload: UpdateProfilePayload) {
  const response = await api.patch<User>("/users/me", payload);
  return response.data;
}
