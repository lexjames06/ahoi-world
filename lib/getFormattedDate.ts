export default function getFormattedDate(date: Date): string {
  const dateString = date.toISOString();
  const trimmed = dateString.slice(0, 19);
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(trimmed));
}