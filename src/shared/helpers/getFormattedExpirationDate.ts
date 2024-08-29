export function getFormattedExpirationDate(): string {
  // Create a new Date object that is one hour ahead of the current time.
  const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);

  // Calculate the time zone offset in milliseconds (the local time zone offset from UTC).
  const timeZoneOffset = expirationDate.getTimezoneOffset() * 60000;

  // Adjust the expiration date by subtracting the time zone offset to convert it to UTC,
  // then convert it to an ISO string and remove the 'Z' indicating UTC time.
  const localISOTime = new Date(expirationDate.getTime() - timeZoneOffset).toISOString().slice(0, -1);

  // Determine the sign of the time zone offset (positive if the local time is behind UTC).
  const offsetSign = timeZoneOffset > 0 ? '-' : '+';

  // Calculate the absolute value of the time zone offset in hours.
  const offsetHours = Math.abs(expirationDate.getTimezoneOffset() / 60);

  // Calculate the absolute value of the remaining minutes after converting the offset to hours.
  const offsetMinutes = Math.abs(expirationDate.getTimezoneOffset() % 60);

  // Return the formatted expiration date with the local time and the appropriate time zone offset.
  return `${localISOTime}${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
}
