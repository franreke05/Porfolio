/**
 * Single source of truth for video-meeting availability.
 * Every rule about WHEN a meeting can be booked lives here.
 */
export type BookingConfig = {
  /** IANA zone the business hours are expressed in. */
  timeZone: string;
  /** Bookable weekdays, 0 = Sunday … 6 = Saturday. */
  weekdays: readonly number[];
  /** Wall-clock window start in `timeZone`, minutes from midnight. */
  windowStartMinutes: number;
  /** Wall-clock window end in `timeZone`, minutes from midnight. */
  windowEndMinutes: number;
  slotMinutes: number;
  /** Gap kept free after each slot (also widens busy intervals). */
  bufferMinutes: number;
  /** How many days ahead (from today in `timeZone`) can be booked. */
  horizonDays: number;
  /** Minimum notice before a slot starts. */
  minNoticeHours: number;
  /** Upper bound for the `days` query parameter. */
  maxDaysPerQuery: number;
};

export const bookingConfig: BookingConfig = {
  timeZone: "Europe/Madrid",
  weekdays: [1, 2, 3, 4, 5],
  windowStartMinutes: 11 * 60,
  windowEndMinutes: 13 * 60,
  slotMinutes: 30,
  bufferMinutes: 0,
  horizonDays: 21,
  minNoticeHours: 12,
  maxDaysPerQuery: 31,
};
