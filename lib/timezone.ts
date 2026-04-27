const CHICAGO_TIME_ZONE = "America/Chicago";

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);

  function readPart(type: Intl.DateTimeFormatPartTypes) {
    const part = parts.find((item) => item.type === type);
    return Number(part?.value ?? "0");
  }

  return {
    year: readPart("year"),
    month: readPart("month"),
    day: readPart("day"),
    hour: readPart("hour"),
    minute: readPart("minute"),
    second: readPart("second")
  };
}

function chicagoDateTimeToUtc(dateOnly: string, hour: number) {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, 0, 0);

  let guess = desiredUtc;

  for (let index = 0; index < 3; index += 1) {
    const zonedParts = getTimeZoneParts(new Date(guess), CHICAGO_TIME_ZONE);
    const zonedAsUtc = Date.UTC(
      zonedParts.year,
      zonedParts.month - 1,
      zonedParts.day,
      zonedParts.hour,
      zonedParts.minute,
      zonedParts.second
    );

    guess += desiredUtc - zonedAsUtc;
  }

  return new Date(guess);
}

export function getTodayInChicago() {
  const now = new Date();

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CHICAGO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

export function getChicagoDayRange(dateOnly: string) {
  const start = chicagoDateTimeToUtc(dateOnly, 0);

  const nextDate = new Date(`${dateOnly}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);

  const nextDateOnly = nextDate.toISOString().slice(0, 10);
  const end = chicagoDateTimeToUtc(nextDateOnly, 0);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString()
  };
}

export function formatChicagoDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatChicagoTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatChicagoDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}
