"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize the state
  useEffect(() => {
    try {
      // Get from local storage by key
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        // Parse stored json or if none return initialValue
        if (item) {
          try {
            const parsedValue = JSON.parse(item)
            setStoredValue(parsedValue)
          } catch (parseError) {
            console.error("Error parsing localStorage data:", parseError)
            // If parsing fails, remove the corrupted data
            window.localStorage.removeItem(key)
            setStoredValue(initialValue)
          }
        }
      }
    } catch (error) {
      // If error also return initialValue
      console.error("Error reading from localStorage:", error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue]
}
