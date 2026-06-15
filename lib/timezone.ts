const DEFAULT_TIMEZONE = 'Asia/Shanghai';

const TIMEZONE_API_URL = 'https://www.timeapi.io/api/timezone/availabletimezones';

const FALLBACK_TIMEZONES = [DEFAULT_TIMEZONE];

export const getSupportedTimezones = () => {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return [];
  }
};

export const loadSupportedTimezones = async () => {
  const timezones = getSupportedTimezones();

  if (timezones.length > 0) return timezones;

  try {
    const response = await fetch(TIMEZONE_API_URL);
    const data = await response.json();

    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_TIMEZONES;
  } catch {
    return FALLBACK_TIMEZONES;
  }
};

export const detectCurrentTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
};
