/* eslint-disable no-prototype-builtins */
import { JSDOM } from 'jsdom'
import { streakCounter } from '../src'
import { formattedDate } from '../src/utils'


const KEY = 'streak'

describe('streakCounter', () => {
  let mockLocalStorage: Storage

  beforeEach(() => {
    const mockJSDom = new JSDOM('', { url: 'https://localhost' })
    mockLocalStorage = mockJSDom.window.localStorage
  })

  afterEach(() => {
    mockLocalStorage.clear()
  })
  it('should return a streak object with currentCount, startDate and lastLoginDate', () => {
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)

    expect(streak.hasOwnProperty('currentCount')).toBe(true)
    expect(streak.hasOwnProperty('startDate')).toBe(true)
    expect(streak.hasOwnProperty('lastLoginDate')).toBe(true)
  })
  it('should return a streak starting at 1 and keep track of lastLoginDate', () => {
    const date = new Date()
    const streak = streakCounter(mockLocalStorage, date)

    const dateFormatted = formattedDate(date)

    expect(streak.currentCount).toBe(1)
    expect(streak.lastLoginDate).toBe(dateFormatted)
  })
  it('should store the streak in localStorage', () => {
    const date = new Date()
    streakCounter(mockLocalStorage, date)

    const streakAsString = mockLocalStorage.getItem(KEY)
    expect(streakAsString).not.toBeNull()
  })
  describe('with a pre-populated streak', () => {
    let mockLocalStorage: Storage

    beforeEach(() => {
      const mockJSDom = new JSDOM('', { url: 'https://localhost' })
      mockLocalStorage = mockJSDom.window.localStorage

      const date = new Date('12/12/2021')

      const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date)
      }
      mockLocalStorage.setItem('streak', JSON.stringify(streak))
    })
    afterEach(() => {
      mockLocalStorage.clear()
    })
    it('should return the streak from localStorage', () => {
      const date = new Date('12/12/2021')
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.startDate).toBe('12/12/2021')
    })
    it('should increment the streak', () => {
      const date = new Date('12/13/2021')
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(2)
    })
    it('should not increment the streak when login days are not consecutive', () => {
      const date = new Date('12/14/2021')
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(1)
    })
    it('should save updated streak to localStorage', () => {
      const date = new Date('12/13/2021')

      streakCounter(mockLocalStorage, date)

      const streakAsString = mockLocalStorage.getItem(KEY)

      const streak = JSON.parse(streakAsString || '')

      expect(streak.currentCount).toBe(2)
    })
    it('should reset if not consecutive', () => {
      const date = new Date('12/13/2021')
      const streak = streakCounter(mockLocalStorage, date)

      expect(streak.currentCount).toBe(2)

      // Skip a day, break the streak
      const updatedDate = new Date('12/15/2021')
      const updatedStreak = streakCounter(mockLocalStorage, updatedDate)

      expect(updatedStreak.currentCount).toBe(1)
    })
    it('should save the reset streak to localStorage', () => {
      const date = new Date('12/13/2021')
      // call the function to update the streak
      streakCounter(mockLocalStorage, date)

      // skip a day, break streak
      const dateUpdated = new Date('12/15/2021')
      const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

      const streakAsString = mockLocalStorage.getItem(KEY)

      const streak = JSON.parse(streakAsString || '')

      expect(streak.currentCount).toBe(1)
    })
    it('should not update the streak for same-day login', () => {
      const date = new Date('12/13/2021')
      // update the streak
      streakCounter(mockLocalStorage, date)

      // same day login
      const dateUpdated = new Date('12/13/2021')
      const streakUpdated = streakCounter(mockLocalStorage, dateUpdated)

      expect(streakUpdated.currentCount).toBe(2)
    })
  })
})
