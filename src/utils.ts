export interface Streak {
  currentCount: number
  startDate: string
  lastLoginDate: string
}

export const KEY = 'streak'
export const formattedDate = (date: Date): string => {
  // returns date as 11/11/2021
  // other times it returns 11/11/2021 12:00:00 AM
  // which is why we call .split at the end
  return date.toLocaleDateString('en-US')
}

export const differenceInDays = (dateLeft: Date, dateRight: Date): number => {
  const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
  const diffInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffInDays
}

export const shouldIncrementOrResetStreakCount = (currentDate: Date, lastLoginDate: string): 'increment' | 'reset' | 'none' => {
  const difference = differenceInDays(currentDate, new Date(lastLoginDate))

  if (difference === 0) {
    return 'none'
  }

  if (difference === 1) {
    return 'increment'
  }

  return 'reset'
}

export const buildStreak = (date: Date, overrideDefaults?: Partial<Streak>): Streak => {
  const defaultStreak: Streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date)
  }

  return {
    ...defaultStreak,
    ...overrideDefaults
  }
}

export const updateStreak = (storage: Storage, streak: Streak): void => {
  storage.setItem(KEY, JSON.stringify(streak))
}
