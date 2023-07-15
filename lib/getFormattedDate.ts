export default function getFormattedDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date);
}