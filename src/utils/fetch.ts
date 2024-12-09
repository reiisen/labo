import { Computer, Lab, Reserve, Room } from "./types";
const offset = 0;

export async function createLab(lab: Omit<Lab, "id">): Promise<boolean> {
  let response;
  try {
    response = await fetch("http://127.0.0.1:8000/lab/create", {
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
  const date = new Date(reserve.date);
  console.log(date);
  date.setDate(date.getDate() + offset);
  const response = await fetch("http://127.0.0.1:8000/reserve/create", {
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
  const response = await fetch("http://127.0.0.1:8000/lab/", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readRooms(): Promise<Room[]> {
  const response = await fetch("http://127.0.0.1:8000/room/", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response.json();
}

export async function readComputers(source: number): Promise<Computer[]> {
  const filter = {
    labId: source
  };
  const response = await fetch("http://127.0.0.1:8000/computer/filter", {
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
  const response = await fetch("http://127.0.0.1:8000/reserve/filter", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}

export async function readCompleteReserves(source: {
  labId: number;
  date: Date;
}): Promise<Reserve[]> {
  const min = new Date(source.date);
  const max = new Date(source.date);
  min.setHours(0);
  min.setDate(min.getDate() + offset);
  max.setHours(17);
  max.setDate(max.getDate() + offset);
  const filter = {
    labId: source.labId,
    date: {
      gte: min,
      lte: max,
    },
    status: {
      in: ["CONCLUDED", "CANCELLED"],
    },
  };
  const response = await fetch("http://127.0.0.1:8000/reserve/filter", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}

export async function readReserves(source: {
  labId: number;
  date: Date;
}): Promise<Reserve[]> {
  const min = new Date(source.date);
  const max = new Date(source.date);
  min.setHours(0);
  min.setDate(min.getDate() + offset);
  max.setHours(17);
  max.setDate(max.getDate() + offset);
  const filter = {
    labId: source.labId,
    date: {
      gte: min,
      lte: max,
    },
    status: {
      in: ["PENDING", "ACTIVE", "CONCLUDED", "CANCELLED"],
    },
  };
  const response = await fetch("http://127.0.0.1:8000/reserve/filter", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(filter),
  });
  return response.json();
}
