import { createMemo, createResource, createSignal, Show } from "solid-js"
import { Computer, Lab, Reserve, Room, WithTimestamp } from "../utils/types"
import { DropdownObject } from "./ui/Dropdown"
import { readComputers, readLabs, readReserves, readRooms } from "../utils/fetch"
import { Table } from "./ui/Table";
import { SimpleDatepicker } from "solid-simple-datepicker";
import { Loading } from "./Loading";
import "solid-simple-datepicker/styles.css";
import { Portal } from "solid-js/web";
import { Switch } from "./ui/Switch";

const overlay = "h-screen w-screen backdrop-blur-sm backdrop-brightness-75 fixed left-1 top-1 -translate-x-1 -translate-y-1"

type HistoryRecord = {
  NIM: string,
  Reason: string,
  Created: string,
  Date: string,
  Status: string
}

const dummyRecord = {
  NIM: "-",
  Reason: "-",
  Created: "-",
  Date: "-",
  Status: "-"
}

function reserveToRecord(reserve: WithTimestamp<Reserve>): HistoryRecord {
  return {
    NIM: reserve.nim,
    Reason: reserve.reason,
    Created: reserve.createdAt.toString(),
    Date: reserve.date.toString(),
    Status: reserve.status
  }
}

export const History = () => {
  const [labs] = createResource(readLabs, { initialValue: [] });
  const [rooms] = createResource(readRooms, { initialValue: [] });
  return (
    <div class="flex flex-col w-3/4">
      <Show when={labs.state === 'ready'} fallback={<Loading />}>
        <HistoryRoot labs={labs()} rooms={rooms()} />
      </Show>
    </div>
  )
}

const HistoryRoot = (props: { labs: Lab[], rooms: Room[] }) => {
  const [lab, setLab] = createSignal<Lab>(props.labs[0]);
  const [room, setRoom] = createSignal<Room>(props.rooms[0]);
  const [date, setDate] = createSignal<Date>(new Date());
  const [open, setOpen] = createSignal(false);

  const [computers] = createResource(lab().id, readComputers, { initialValue: [] });
  const [computer, setComputer] = createSignal<Computer>(computers()[0]);

  const [filter, setFilter] = createSignal({ labId: lab().id, date: date() });

  createMemo(() => setFilter({ labId: lab().id, date: date() }));

  const [reserves] = createResource(filter, readReserves, { initialValue: [] });

  return (
    <>
      <div class="flex flex-row">
        <DropdownObject data={props.labs} signal={[lab, setLab]} />
        <DropdownObject data={props.rooms} signal={[room, setRoom]} />
        <button
          class="select__trigger"
          onClick={() => {
            setOpen(true);

            const handleEscape = (event: KeyboardEvent) => {
              if (event.key === 'Escape') {
                setOpen(false);
                document.removeEventListener('keydown', handleEscape);
              }
            };

            document.addEventListener('keydown', handleEscape);
          }}
        >Pick Date
        </button>

      </div>
      <Show when={reserves.state === 'ready'}>
        <Table<HistoryRecord> data={reserves() ? reserves().map((value) => reserveToRecord(value as WithTimestamp<Reserve>)) : [dummyRecord]} />
      </Show>
      <Show when={open()}>
        <Portal>
          <div class={overlay} onClick={() => setOpen(false)} />
          <SimpleDatepicker
            class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            selectedDate={date()}
            onChange={(date) => { setDate(date) }}
            onFooterDone={() => setOpen(false)}
          />
        </Portal>
      </Show>
    </>
  )
}
