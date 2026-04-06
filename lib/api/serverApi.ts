import axios from "axios";
import type { AxiosResponse } from "axios";
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

async function getServerApi(cookieHeader?: string) {
  const cookieStore = cookieHeader ? null : await cookies();

  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Cookie: cookieHeader ?? cookieStore?.toString() ?? "",
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

export async function checkSession(
  cookieHeader?: string,
): Promise<AxiosResponse<SessionResponse>> {
  const serverApi = await getServerApi(cookieHeader);
  return serverApi.get<SessionResponse>("/auth/session");
}
