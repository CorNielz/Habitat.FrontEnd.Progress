import { api } from './api';

export interface HabitRecordResponse {
  id: number;
  habitId: number;
  recordDate: string;
  note?: string | null;
  recordedAt: string;
}

interface PagedHabitRecordResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: HabitRecordResponse[];
}

export interface CreateHabitRecordRequest {
  recordDate: string;
  note?: string;
}

function toParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
}

export async function listHabitRecords(
  habitId: string,
  params: { page?: number; pageSize?: number; from?: string; to?: string } = {}
): Promise<HabitRecordResponse[]> {
  const pageSize = params.pageSize ?? 100;
  let page = params.page ?? 1;
  let totalPages = 1;
  const records: HabitRecordResponse[] = [];

  do {
    const response = (await api.get(
      `/habits/${habitId}/records`,
      toParams({ ...params, page, pageSize })
    )) as PagedHabitRecordResponse;

    totalPages = response.totalPages || 1;
    records.push(...response.items);
    page += 1;
  } while (page <= totalPages);

  return records;
}

export async function createHabitRecord(
  habitId: string,
  data: CreateHabitRecordRequest
): Promise<HabitRecordResponse> {
  return (await api.post(`/habits/${habitId}/records`, data)) as HabitRecordResponse;
}

export async function deleteHabitRecordByDate(
  habitId: string,
  recordDate: string
): Promise<void> {
  await api.del(`/habits/${habitId}/records`, { recordDate });
}
