export const formatTo12Hour = (time: string) => {
  const [hour] = time.split(":");
  const hourNum = parseInt(hour, 10);
  if (hourNum === 0) return "12:00 AM";
  if (hourNum === 12) return "12:00 PM";
  if (hourNum > 12) {
    return `${(hourNum - 12).toString().padStart(2, "0")}:00 PM`;
  }
  return `${hour}:00 AM`;
};

export function formatDate(date: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const dayOfWeek = days[date.getDay()];
  return {
    date: `${monthName} ${day}`,
    dayOfWeek: dayOfWeek,
  };
}
