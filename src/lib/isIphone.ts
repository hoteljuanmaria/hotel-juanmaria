'use client'

/**
 * A utility function to detect if the current device is an iPhone.
 * @returns {boolean} - Returns `true` if the device is an iPhone, otherwise `false`.
 */
export function isIphone(): boolean {
  try {
    const userAgent = navigator.userAgent || navigator.vendor
    const iphonePattern = /iPhone/i
    return iphonePattern.test(userAgent)
  } catch (error) {
    console.error('Error detecting device:', error)
    return false // Return false if there's an error (e.g., `navigator` is unavailable)
  }
}
