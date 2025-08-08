// Date Creation and Manipulation
export const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month - 1, day); // month is 0-indexed
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Date Comparison
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const isSameWeek = (date1: Date, date2: Date): boolean => {
  const startOfWeek1 = getStartOfWeek(date1);
  const startOfWeek2 = getStartOfWeek(date2);
  return isSameDay(startOfWeek1, startOfWeek2);
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const isBefore = (date1: Date, date2: Date): boolean => {
  return date1.getTime() < date2.getTime();
};

export const isAfter = (date1: Date, date2: Date): boolean => {
  return date1.getTime() > date2.getTime();
};

export const isBetween = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

// Date Range Helpers
export const getStartOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getEndOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

export const getStartOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = result.getDate() - day; // Sunday is 0
  result.setDate(diff);
  return getStartOfDay(result);
};

export const getEndOfWeek = (date: Date): Date => {
  const startOfWeek = getStartOfWeek(date);
  return getEndOfDay(addDays(startOfWeek, 6));
};

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

export const getStartOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 0, 1);
};

export const getEndOfYear = (date: Date): Date => {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
};

// Difference Calculations
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getWeeksDifference = (date1: Date, date2: Date): number => {
  return Math.floor(getDaysDifference(date1, date2) / 7);
};

export const getMonthsDifference = (date1: Date, date2: Date): number => {
  const yearsDiff = date2.getFullYear() - date1.getFullYear();
  const monthsDiff = date2.getMonth() - date1.getMonth();
  return yearsDiff * 12 + monthsDiff;
};

export const getYearsDifference = (date1: Date, date2: Date): number => {
  return date2.getFullYear() - date1.getFullYear();
};

// Age Calculation
export const calculateAge = (birthDate: Date, referenceDate: Date = new Date()): number => {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getAgeInMonths = (birthDate: Date, referenceDate: Date = new Date()): number => {
  const years = calculateAge(birthDate, referenceDate);
  const months = getMonthsDifference(birthDate, referenceDate) - (years * 12);
  return years * 12 + months;
};

// Validation Helpers
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isThisWeek = (date: Date): boolean => {
  return isSameWeek(date, new Date());
};

export const isThisMonth = (date: Date): boolean => {
  return isSameMonth(date, new Date());
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date);
};

// Business Logic Helpers
export const getNextWorkday = (date: Date): Date => {
  let nextDay = addDays(date, 1);
  while (isWeekend(nextDay)) {
    nextDay = addDays(nextDay, 1);
  }
  return nextDay;
};

export const getPreviousWorkday = (date: Date): Date => {
  let prevDay = addDays(date, -1);
  while (isWeekend(prevDay)) {
    prevDay = addDays(prevDay, -1);
  }
  return prevDay;
};

export const getWorkdaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const workdays: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isWeekday(currentDate)) {
      workdays.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return workdays;
};

// Tournament/Season Helpers
export const getCurrentSeason = (date: Date = new Date()): number => {
  // Season starts in September and ends in August of next year
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-indexed
  
  return month >= 9 ? year : year - 1;
};

export const getSeasonStartDate = (seasonYear: number): Date => {
  return new Date(seasonYear, 8, 1); // September 1st
};

export const getSeasonEndDate = (seasonYear: number): Date => {
  return new Date(seasonYear + 1, 7, 31); // August 31st of next year
};

export const isInSeason = (date: Date, seasonYear?: number): boolean => {
  const season = seasonYear || getCurrentSeason(date);
  const startDate = getSeasonStartDate(season);
  const endDate = getSeasonEndDate(season);
  
  return isBetween(date, startDate, endDate);
};

// Date Array Generators
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

export const getWeekdaysInMonth = (year: number, month: number): Date[] => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = getEndOfMonth(startOfMonth);
  
  return getDatesInRange(startOfMonth, endOfMonth).filter(isWeekday);
};

// Timezone and Parsing
export const parseDate = (dateString: string): Date | null => {
  const date = new Date(dateString);
  return isValidDate(date) ? date : null;
};

export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const fromISODateString = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z');
};

// Relative Time Helpers
export const getRelativeTimeInDays = (date: Date, referenceDate: Date = new Date()): string => {
  const days = getDaysDifference(referenceDate, date);
  
  if (isSameDay(date, referenceDate)) return 'Hôm nay';
  if (isSameDay(date, addDays(referenceDate, 1))) return 'Ngày mai';
  if (isSameDay(date, addDays(referenceDate, -1))) return 'Hôm qua';
  
  if (isAfter(date, referenceDate)) {
    return `${days} ngày nữa`;
  } else {
    return `${days} ngày trước`;
  }
};

export const isDateInFuture = (date: Date, days: number = 0): boolean => {
  const futureDate = addDays(new Date(), days);
  return isAfter(date, futureDate);
};

export const isDateInPast = (date: Date, days: number = 0): boolean => {
  const pastDate = addDays(new Date(), -days);
  return isBefore(date, pastDate);
};
