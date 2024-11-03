/**
 * Collection of utility functions for string manipulation
 * @module stringUtils
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The input string to capitalize
 * @returns {string} The input string with its first letter capitalized
 * @throws {TypeError} When input is not a string
 * @example
 * capitalizeFirstLetter('hello') // returns 'Hello'
 * capitalizeFirstLetter('john doe') // returns 'John doe'
 */

export function capitalizeFirstLetter(str: string): string {
  if (typeof str !== "string") {
    throw new TypeError("Input must be a string");
  }

  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if a string is empty or contains only whitespace
 * @param {string} str - The string to check
 * @returns {boolean} True if the string is empty or contains only whitespace
 */
export function isEmpty(str: string): boolean {
  return str.trim().length === 0;
}
