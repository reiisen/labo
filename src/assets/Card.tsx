import { Component } from "solid-js";
import { Lab, Schedule } from "../utils/types";

export const LabCard: Component<Lab> = (props) => {
  return (
    <a href={`/schedule/${props.id}`}>
      <div class="flex flex-col bg-red-200 w-64 rounded-lg px-2 py-1">
        <span>{props.name}</span>
        <span>{props.code}</span>
        <span>Lantai {props.floor}</span>
      </div>
    </a>
  )
}

export const ScheduleCard: Component<Schedule> = (props) => {
  return (
    <div class="flex flex-col bg-red-200 rounded-lg px-2 py-1">
      <span>Timeslot: {props.timeslot}</span>
      <span>Day: {props.day}</span>
      <span>Length: {props.length}</span>
      <span>SubjectId: {props.subjectId}</span>
      <span>LabId: {props.labId}</span>
    </div>
  )
}
