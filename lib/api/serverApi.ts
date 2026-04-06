import axios from "axios";
import { cookies } from "next/headers";
import type { Note, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";

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

async function getServerApi() {
  const cookieStore = await cookies();

  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}

export async function fetchNotes(params: FetchNotesParams = {}) {
  const serverApi = await getServerApi();
  const response = await serverApi.get<NotesResponse>("/notes", {
    params: {
      perPage: 12,
      ...params,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const serverApi = await getServerApi();
  const response = await serverApi.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function getMe() {
  const serverApi = await getServerApi();
  const response = await serverApi.get<User>("/users/me");
  return response.data;
}

export async function checkSession() {
  const serverApi = await getServerApi();
  const response = await serverApi.get<SessionResponse>("/auth/session");
  return response.data;
}
