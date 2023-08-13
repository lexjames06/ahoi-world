export default function getFormattedDate(date: Date): string {
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const dateString = `${day} ${month} ${year}`;
  return dateString;
}

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