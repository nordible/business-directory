/**
 * Timezone-aware Opening Hours Evaluator
 * Accurately determines open/closed status based on the business's physical local time,
 * regardless of the visitor's device location (e.g. browsing from Mumbai for a Dubai business).
 */

import { WeekSchedule } from '@/lib/types';

export interface BusinessOpenStatus {
  isOpen: boolean;
  timezone: string;
  localTime: string;
  dayName: string;
  locationName: string;
}

const CITY_TIMEZONE_MAP: Record<string, string> = {
  // UAE / Middle East
  dubai: 'Asia/Dubai',
  'abu dhabi': 'Asia/Dubai',
  uae: 'Asia/Dubai',
  'united arab emirates': 'Asia/Dubai',
  'vereinigte arabische emirate': 'Asia/Dubai',
  doha: 'Asia/Qatar',
  qatar: 'Asia/Qatar',
  riyadh: 'Asia/Riyadh',

  // India
  mumbai: 'Asia/Kolkata',
  delhi: 'Asia/Kolkata',
  'new delhi': 'Asia/Kolkata',
  bengaluru: 'Asia/Kolkata',
  bangalore: 'Asia/Kolkata',
  hyderabad: 'Asia/Kolkata',
  chennai: 'Asia/Kolkata',
  kolkata: 'Asia/Kolkata',
  india: 'Asia/Kolkata',
  indien: 'Asia/Kolkata',

  // United States & Americas
  'new york': 'America/New_York',
  nyc: 'America/New_York',
  boston: 'America/New_York',
  miami: 'America/New_York',
  chicago: 'America/Chicago',
  houston: 'America/Chicago',
  denver: 'America/Denver',
  'los angeles': 'America/Los_Angeles',
  'san francisco': 'America/Los_Angeles',
  seattle: 'America/Los_Angeles',
  toronto: 'America/Toronto',
  vancouver: 'America/Vancouver',

  // UK & Ireland
  london: 'Europe/London',
  manchester: 'Europe/London',
  birmingham: 'Europe/London',
  edinburgh: 'Europe/London',
  dublin: 'Europe/Dublin',
  'united kingdom': 'Europe/London',

  // Asia / Pacific
  tokyo: 'Asia/Tokyo',
  japan: 'Asia/Tokyo',
  singapore: 'Asia/Singapore',
  singapur: 'Asia/Singapore',
  sydney: 'Australia/Sydney',
  melbourne: 'Australia/Melbourne',
  hongkong: 'Asia/Hong_Kong',
  'hong kong': 'Asia/Hong_Kong',

  // DACH & Europe
  frankfurt: 'Europe/Berlin',
  'frankfurt am main': 'Europe/Berlin',
  berlin: 'Europe/Berlin',
  münchen: 'Europe/Berlin',
  munich: 'Europe/Berlin',
  hamburg: 'Europe/Berlin',
  köln: 'Europe/Berlin',
  cologne: 'Europe/Berlin',
  stuttgart: 'Europe/Berlin',
  düsseldorf: 'Europe/Berlin',
  offenbach: 'Europe/Berlin',
  'offenbach am main': 'Europe/Berlin',
  rödermark: 'Europe/Berlin',
  wien: 'Europe/Vienna',
  vienna: 'Europe/Vienna',
  zürich: 'Europe/Zurich',
  zurich: 'Europe/Zurich',
  geneva: 'Europe/Zurich',
  genf: 'Europe/Zurich',
  paris: 'Europe/Paris',
  madrid: 'Europe/Madrid',
  barcelona: 'Europe/Madrid',
  rome: 'Europe/Rome',
  rom: 'Europe/Rome',
  milan: 'Europe/Rome',
  amsterdam: 'Europe/Amsterdam',
};

/**
 * Resolves the IANA timezone for a business based on its city, state, or country
 */
export function resolveBusinessTimezone(business: {
  city?: string;
  country?: string;
  state?: string;
  address?: string;
}): string {
  const candidates = [business.city, business.country, business.state, business.address]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const [key, tz] of Object.entries(CITY_TIMEZONE_MAP)) {
    if (candidates.includes(key)) {
      return tz;
    }
  }

  // Default to central European time
  return 'Europe/Berlin';
}

/**
 * Extracts current local time parts (weekday, hours, minutes) in a target timezone
 */
export function getLocalTimeInTimezone(timezone: string, date: Date = new Date(), locale: string = 'en-US'): {
  weekdayKey: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  hour: number;
  minute: number;
  timeString: string;
  dayName: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    let weekdayStr = 'Monday';
    let hourStr = '12';
    let minuteStr = '00';

    for (const p of parts) {
      if (p.type === 'weekday') weekdayStr = p.value;
      if (p.type === 'hour') hourStr = p.value;
      if (p.type === 'minute') minuteStr = p.value;
    }

    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const weekdayKey = weekdayStr.toLowerCase() as
      | 'sunday'
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday';

    let dayName = weekdayStr;
    try {
      const localDayFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        weekday: 'long',
      });
      dayName = localDayFormatter.format(date);
    } catch {
      // Fallback to English weekday string
    }

    return {
      weekdayKey,
      hour,
      minute,
      timeString: `${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}`,
      dayName,
    };
  } catch {
    // Fallback if timezone string is unsupported
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday')[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return {
      weekdayKey: days[date.getDay()],
      hour: date.getHours(),
      minute: date.getMinutes(),
      timeString: `${hours}:${mins}`,
      dayName: days[date.getDay()],
    };
  }
}

/**
 * Parses a standard string range like "09:00 - 18:00" or "10:00 - 19:30"
 */
function isTimeWithinRange(
  currentMinutes: number,
  openStr: string,
  closeStr: string
): boolean {
  const [oH, oM = 0] = openStr.split(':').map(Number);
  const [cH, cM = 0] = closeStr.split(':').map(Number);

  const openMinutes = oH * 60 + oM;
  const closeMinutes = cH * 60 + cM;

  if (closeMinutes < openMinutes) {
    // Crosses midnight (e.g. 16:00 to 02:00)
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Evaluates whether a business is open right now in its local timezone.
 */
export function isBusinessOpenNow(
  business: {
    hours?: string;
    openingHoursJson?: WeekSchedule;
    city?: string;
    country?: string;
    state?: string;
    address?: string;
  },
  locale: string = 'en'
): BusinessOpenStatus {
  const timezone = resolveBusinessTimezone(business);
  const local = getLocalTimeInTimezone(timezone, new Date(), locale);
  const locationName = business.city || business.country || 'Lokal';

  const rawHours = (business.hours || '').trim();

  // 1. Explicit 24/7 rule
  if (/24\/7|rund um die uhr|round the clock/i.test(rawHours)) {
    return {
      isOpen: true,
      timezone,
      localTime: local.timeString,
      dayName: local.dayName,
      locationName,
    };
  }

  // 2. Structured JSON schedule (High precision)
  if (business.openingHoursJson && Object.keys(business.openingHoursJson).length > 0) {
    const todaySchedule = business.openingHoursJson[local.weekdayKey];

    if (todaySchedule) {
      if (todaySchedule.closed) {
        return {
          isOpen: false,
          timezone,
          localTime: local.timeString,
          dayName: local.dayName,
          locationName,
        };
      }

      if (todaySchedule.open && todaySchedule.close) {
        const currentMinutes = local.hour * 60 + local.minute;
        const isOpen = isTimeWithinRange(
          currentMinutes,
          todaySchedule.open,
          todaySchedule.close
        );
        return {
          isOpen,
          timezone,
          localTime: local.timeString,
          dayName: local.dayName,
          locationName,
        };
      }
    }
  }

  // 3. String-based fallback (e.g. "Mon - Fri: 09:00 - 18:00")
  if (rawHours) {
    const currentMinutes = local.hour * 60 + local.minute;
    const isWeekend = local.weekdayKey === 'saturday' || local.weekdayKey === 'sunday';
    const isSunday = local.weekdayKey === 'sunday';

    // Matches patterns like "Mon - Fri: 09:00 - 18:00"
    const monFriMatch = rawHours.match(/(?:mon|mo)\s*-\s*(?:fri|fr)[^:]*:\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/i);
    if (monFriMatch) {
      if (isWeekend) {
        return { isOpen: false, timezone, localTime: local.timeString, dayName: local.dayName, locationName };
      }
      const isOpen = isTimeWithinRange(currentMinutes, monFriMatch[1], monFriMatch[2]);
      return { isOpen, timezone, localTime: local.timeString, dayName: local.dayName, locationName };
    }

    // Matches patterns like "Mon - Sat: 10:00 - 19:30"
    const monSatMatch = rawHours.match(/(?:mon|mo)\s*-\s*(?:sat|sa)[^:]*:\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/i);
    if (monSatMatch) {
      if (isSunday) {
        return { isOpen: false, timezone, localTime: local.timeString, dayName: local.dayName, locationName };
      }
      const isOpen = isTimeWithinRange(currentMinutes, monSatMatch[1], monSatMatch[2]);
      return { isOpen, timezone, localTime: local.timeString, dayName: local.dayName, locationName };
    }

    // Generic generic time pattern "HH:MM - HH:MM"
    const genericTime = rawHours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (genericTime) {
      const isOpen = isTimeWithinRange(currentMinutes, genericTime[1], genericTime[2]);
      return { isOpen, timezone, localTime: local.timeString, dayName: local.dayName, locationName };
    }
  }

  // Default fallback
  return {
    isOpen: false,
    timezone,
    localTime: local.timeString,
    dayName: local.dayName,
    locationName,
  };
}
