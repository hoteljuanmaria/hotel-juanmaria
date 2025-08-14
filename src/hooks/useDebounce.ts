'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Debounces a value by the specified delay.
 * Returns the debounced value and a cancel function to clear pending timeouts.
 */
export function useDebouncedValue<T>(value: T, delay = 200) {
  const [debounced, setDebounced] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebounced(value), delay)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [value, delay])

  const cancel = useMemo(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
    },
    [],
  )

  return [debounced, cancel] as const
}

/**
 * Returns a debounced function reference that delays invocation until after delay ms.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 200,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useMemo(() => {
    const debounced = (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => fn(...args), delay)
    }
    ;(debounced as any).cancel = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
    }
    return debounced as T & { cancel: () => void }
  }, [fn, delay])
}
