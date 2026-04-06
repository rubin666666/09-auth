import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { Note, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

type FetchNotesParams = {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
};

type SessionResponse = {
  success: boolean;
};

const baseURL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api`;

async function getCookieHeader(cookieHeader?: string) {
  if (cookieHeader) {
    return cookieHeader;
  }

  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(params: FetchNotesParams = {}) {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      perPage: 12,
      ...params,
    },
    headers: {
      Cookie: await getCookieHeader(),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(),
    },
  });
  return response.data;
}

export async function checkSession(
  cookieHeader?: string,
): Promise<AxiosResponse<SessionResponse>> {
  return api.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });
}
