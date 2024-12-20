import { Computer, Lab, Reserve, Room, Timestamp, WithInactive, WithTimestamp } from "./types";
const offset = 0;

const baseUrl = import.meta.env.VITE_API_URL;

function shallow<T,>(obj: WithTimestamp<T>): T {
  const { createdAt, updatedAt, ...t } = obj;
  return t as T;
}

export async function createLab(lab: Omit<Lab, "id">): Promise<boolean> {
  const url = new URL(`/lab/create`, baseUrl);
  let response;
  try {
    response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(lab),
    });
  } catch { }

  if (response!.status !== 200) {
    return false;
  }

  return true;
}

export async function createReserve(
  reserve: Omit<Reserve, "id" | "status">
): Promise<boolean> {
  const url = new URL(`/reserve/create`, baseUrl);
  const date = new Date(reserve.date);
  console.log(date);
  date.setDate(date.getDate() + offset);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ ...reserve, date: date }),
  });

  if (response.status !== 200) {
    return false;
  }

  return true;
}

export async function readLabs(): Promise<Lab[]> {
  const url = new URL(`/lab/`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readLabsWithInactive(): Promise<WithInactive<Lab>[]> {
  const url = new URL(`/lab/`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readRooms(): Promise<Room[]> {
  const url = new URL(`/room/`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readRoomsWithInactive(): Promise<WithInactive<Room>[]> {
  const url = new URL(`/room/`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readComputers(source: number): Promise<Computer[]> {
  const url = new URL(`/computer/filter`, baseUrl);
  const filter = {
    labId: source
  };
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter)
  });
  return response.json();
}

export async function readComputersWithInactive(source: number): Promise<WithInactive<Computer>[]> {
  const url = new URL(`/computer/filter`, baseUrl);
  const filter = {
    labId: source
  };
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter)
  });
  return response.json();
}

export async function readIncompleteReserves(source: {
  labId?: number,
  computerId?: number,
  roomId?: number,
  date: Date
}): Promise<Reserve[]> {
  const url = new URL(`/reserve/filter`, baseUrl);
  const min = new Date(source.date);
  const max = new Date(source.date);
  min.setHours(0);
  min.setDate(min.getDate() + offset);
  max.setHours(17, 1);
  max.setDate(max.getDate() + offset);
  const filter = {
    labId: source.labId ? source.labId : undefined,
    computerId: source.computerId ? source.computerId : undefined,
    roomId: source.roomId ? source.roomId : undefined,
    date: {
      gte: min,
      lte: max,
    },
    status: {
      in: ["PENDING", "ACTIVE"],
    },
  };
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}

export async function readCompleteReserves(source: {
  labId?: number,
  computerId?: number,
  roomId?: number,
  date: Date
}): Promise<Reserve[]> {
  const url = new URL(`/reserve/filter`, baseUrl);
  const min = new Date(source.date);
  const max = new Date(source.date);
  min.setHours(0);
  min.setDate(min.getDate() + offset);
  max.setHours(17);
  max.setDate(max.getDate() + offset);
  const filter = {
    labId: source.labId ? source.labId : undefined,
    computerId: source.computerId ? source.computerId : undefined,
    roomId: source.roomId ? source.roomId : undefined,
    date: {
      gte: min,
      lte: max,
    },
    status: {
      in: ["CONCLUDED", "CANCELLED"],
    },
  };
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}

export async function readReserves(source: {
  labId?: number,
  computerId?: number,
  roomId?: number,
  date: Date
}): Promise<Reserve[]> {
  const url = new URL(`/reserve/filter`, baseUrl);
  const min = new Date(source.date);
  const max = new Date(source.date);
  min.setHours(0);
  min.setDate(min.getDate() + offset);
  max.setHours(17);
  max.setDate(max.getDate() + offset);
  const filter = {
    labId: source.labId ? source.labId : undefined,
    computerId: source.computerId ? source.computerId : undefined,
    roomId: source.roomId ? source.roomId : undefined,
    date: {
      gte: min,
      lte: max,
    },
    status: {
      in: ["PENDING", "ACTIVE", "CONCLUDED", "CANCELLED"],
    },
  };
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}

export async function updateLab(
  id: number,
  data: Partial<Lab> | string,
  shallowed?: boolean
) {
  const url = new URL(`/lab/${id}/update`, baseUrl);
  if (shallowed && typeof data !== "string") {
    data = shallow<Partial<Lab>>(data as WithTimestamp<Partial<Lab>>);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: typeof data === "string" ? data : JSON.stringify(data),
  });

  return response.json();
}

export async function updateRoom(
  id: number,
  data: Partial<Room> | string,
  shallowed?: boolean
) {
  const url = new URL(`/room/${id}/update`, baseUrl);
  if (shallowed && typeof data !== "string") {
    data = shallow<Partial<Room>>(data as WithTimestamp<Partial<Room>>);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: typeof data === "string" ? data : JSON.stringify(data),
  });

  return response.json();
}

export async function deleteLab(id: number) {
  const url = new URL(`/lab/${id}/remove`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET"
  });
  return response.json();
}

export async function deleteRoom(id: number) {
  const url = new URL(`/room/${id}/remove`, baseUrl);
  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET"
  });
  return response.json();
}

export async function toggleLab(id: number): Promise<void> {
  const url = new URL(`/lab/${id}/toggle`, baseUrl);

  const response = await fetch(url.toString(), {
    method: "POST"
  });
}

export async function toggleComputer(id: number): Promise<void> {
  const url = new URL(`/computer/${id}/toggle`, baseUrl);
  const response = await fetch(url.toString(), {
    method: "POST"
  });
}

export async function toggleRoom(id: number): Promise<void> {
  const url = new URL(`/room/${id}/toggle`, baseUrl);
  const response = await fetch(url.toString(), {
    method: "POST"
  });
}
