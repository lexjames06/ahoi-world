import { Timestamp } from "firebase/firestore";

export class ConvertTime {
  static toTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  static fromTimestamp(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }
}