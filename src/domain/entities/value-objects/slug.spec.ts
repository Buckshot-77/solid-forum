import { describe, it, expect } from 'vitest'
import { Slug } from './slug'

describe('Slug unit tests', () => {
  it('should be able to create a slug from text', () => {
    const testString = 'An incredible day to be alive'

    const slug = Slug.createFromText(testString)

    expect(slug.value).toBe('an-incredible-day-to-be-alive')
  })

  it('should be able to slice a string that is too big, to use only the first 50 characters, maximum', () => {
    const testString =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

    const slug = Slug.createFromText(testString)

    expect(slug.value).toBe('lorem-ipsum-dolor-sit-amet-consectetur-adipiscing')
  })
})
