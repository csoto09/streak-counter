import { formattedDate, shouldIncrementOrResetStreakCount, buildStreak, Streak, updateStreak, KEY } from './utils'

export function streakCounter(localStorage: Storage, date: Date): Streak {
  const streakInLocalStorage = localStorage.getItem(KEY)
  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage) as Streak
      const state = shouldIncrementOrResetStreakCount(date, streak.lastLoginDate)
      const SHOULD_INCREMENT = state === 'increment'
      const SHOULD_RESET = state === 'reset'

      if (SHOULD_INCREMENT) {
        const updatedStreak = buildStreak(date, {
          startDate: streak.startDate,
          currentCount: streak.currentCount + 1,
          lastLoginDate: formattedDate(date)
        })
        // store in LocalStorage
        updateStreak(localStorage, updatedStreak)
        return updatedStreak
      }
      if (SHOULD_RESET) {
        const updatedStreak = buildStreak(date)
        // reset values in localStorage
        updateStreak(localStorage, updatedStreak)
        return updatedStreak
      }
      return streak
    } catch (error) {
      console.error('failed to parse streak from localStorage')
    }
  }

  const streak = buildStreak(date)
  updateStreak(localStorage, streak)

  return streak
}
