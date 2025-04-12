export type User = {
  authProvider: string;
  username: string;
  email: string;
};

export interface TimeSlot {
  date: string;
  time: string;
}

export type Event = {
  name: string;
  selectedDates: number[];
  startTime: string;
  endTime: string;
  availables: Record<string, Array<TimeSlot>>;
};
