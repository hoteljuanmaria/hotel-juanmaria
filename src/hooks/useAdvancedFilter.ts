'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDebouncedValue } from './useDebounce'

type Comparator<T> = (a: T, b: T) => number

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T = any> {
  by?: keyof T | ((item: T) => any)
  direction?: SortDirection
  comparator?: Comparator<T>
}

export interface PaginationConfig {
  page: number
  pageSize: number
}

export type FilterPredicate<T> = (item: T) => boolean

export type FilterCriteria<T = any> = {
  predicate?: FilterPredicate<T>
  /** If true, this filter group uses OR between its predicates; default AND. */
  mode?: 'AND' | 'OR'
}

export interface FilterConfig<T> {
  data: T[]
  filters: Record<string, FilterCriteria<T>>
  sortConfig?: SortConfig<T>
  pagination?: PaginationConfig
  /** Debounce time for heavy filtering operations */
  debounceMs?: number
  /** Storage key to persist state */
  storageKey?: string
  /** If true, sync to URL search params */
  syncUrl?: boolean
}

export function useAdvancedFilter<T>(config: FilterConfig<T>) {
  const {
    data,
    filters,
    sortConfig,
    pagination,
    debounceMs = 150,
    storageKey,
    syncUrl = true,
  } = config

  const [rawFilters, setRawFilters] = useState(filters)
  const [rawSort, setRawSort] = useState(sortConfig)
  const [rawPagination, setRawPagination] = useState<
    PaginationConfig | undefined
  >(pagination)
  const [isFiltering, setIsFiltering] = useState(false)

  // Persist/rehydrate
  useEffect(() => {
    if (!storageKey) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Do not attempt to rehydrate filters (functions are not serializable)
        if (parsed.sortConfig) setRawSort(parsed.sortConfig)
        if (parsed.pagination) setRawPagination(parsed.pagination)
      }
    } catch {}
     
  }, [storageKey])

  // Keep predicates in sync when callers provide new ones, but avoid update loops
  // by only updating when the external value is meaningfully different.
  type FilterMap = Record<string, FilterCriteria<T>>
  const filtersEqual = useCallback((a: FilterMap, b: FilterMap) => {
    if (a === b) return true
    const aKeys = Object.keys(a || {})
    const bKeys = Object.keys(b || {})
    if (aKeys.length !== bKeys.length) return false
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      const aCrit = a[key]
      const bCrit = b[key]
      if (!aCrit && !bCrit) continue
      if (!aCrit || !bCrit) return false
      if ((aCrit.mode ?? 'AND') !== (bCrit.mode ?? 'AND')) return false
      // Compare predicate by reference or by function source to avoid false diffs
      const aPred = aCrit.predicate as any
      const bPred = bCrit.predicate as any
      if (aPred === bPred) continue
      // Fall back to comparing function source when available
      const aSrc = typeof aPred === 'function' ? String(aPred) : String(aPred)
      const bSrc = typeof bPred === 'function' ? String(bPred) : String(bPred)
      if (aSrc !== bSrc) return false
    }
    return true
  }, [])

  useEffect(() => {
    setRawFilters((prev) => (filtersEqual(prev, filters) ? prev : filters))
  }, [filters, filtersEqual])

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ sortConfig: rawSort, pagination: rawPagination }),
      )
    } catch {}
  }, [rawSort, rawPagination, storageKey])

  // URL sync (shallow: only minimal info)
  useEffect(() => {
    if (!syncUrl || typeof window === 'undefined') return
    const url = new URL(window.location.href)
    // Store a compact representation; consumers can extend as needed
    url.searchParams.set('page', String(rawPagination?.page ?? 1))
    url.searchParams.set('pageSize', String(rawPagination?.pageSize ?? 0))
    // Not serializing functions; just an indicator to rehydrate from storage
    if (storageKey) url.searchParams.set('state', storageKey)
    window.history.replaceState({}, '', url.toString())
  }, [rawPagination, storageKey, syncUrl])

  // Debounce the heavy work by changing a version ref
  const [filtersVersion, setFiltersVersion] = useState(0)
  useEffect(() => {
    // Start a new filtering pass when inputs change
    if (!isFiltering) setIsFiltering(true)
    setFiltersVersion((v) => v + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawFilters, rawSort, data])
  const [debouncedVersion] = useDebouncedValue(filtersVersion, debounceMs)

  const predicates = useMemo(() => {
    // build predicate list from rawFilters map
    return Object.values(rawFilters).filter(Boolean)
  }, [rawFilters])

  const filtered = useMemo(() => {
    // short-circuit
    if (!predicates.length) return data

    // Merge predicates; support group modes later if needed
    return data.filter((item) => {
      // Each filter group uses its predicate; groups combined with AND by default
      for (const criteria of Object.values(rawFilters)) {
        if (!criteria?.predicate) continue
        const pass = criteria.predicate(item)
        if (!pass && (criteria.mode ?? 'AND') === 'AND') return false
        if (pass && (criteria.mode ?? 'AND') === 'OR') return true
      }
      // For OR-only groups, if none returned true earlier, evaluate again
      // by ensuring at least one OR group passed. If no OR groups, pass.
      const hasOr = Object.values(rawFilters).some(
        (c) => (c?.mode ?? 'AND') === 'OR' && c.predicate,
      )
      if (hasOr) {
        return Object.values(rawFilters).some(
          (c) =>
            (c?.mode ?? 'AND') === 'OR' && c.predicate && c.predicate(item),
        )
      }
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVersion, data, rawFilters, predicates.length])

  const sorted = useMemo(() => {
    if (!rawSort) return filtered
    const { by, direction = 'asc', comparator } = rawSort
    const dir = direction === 'asc' ? 1 : -1
    const list = filtered.slice()
    if (comparator) return list.sort(comparator)
    if (!by) return list
    const accessor =
      typeof by === 'function' ? by : (i: any) => i[by as keyof T]
    return list.sort((a, b) => {
      const va = accessor(a)
      const vb = accessor(b)
      if (va === vb) return 0
      return va > vb ? dir : -dir
    })
  }, [filtered, rawSort])

  const paged = useMemo(() => {
    if (!rawPagination) return { items: sorted, total: sorted.length }
    const start = (rawPagination.page - 1) * rawPagination.pageSize
    const end = start + rawPagination.pageSize
    return { items: sorted.slice(start, end), total: sorted.length }
  }, [sorted, rawPagination])

  // Mark filtering as complete once the debounced computation has run.
  // Using the debounced version avoids depending on array/object identities
  // like `paged.items` which can change by reference and cause loops.
  useEffect(() => {
    if (!isFiltering) return
    setIsFiltering(false)
     
  }, [debouncedVersion, isFiltering])

  // Setters
  const setFilter = useCallback(
    (
      key: string,
      predicate: FilterPredicate<T> | undefined,
      mode: 'AND' | 'OR' = 'AND',
    ) => {
      setRawFilters((prev) => ({ ...prev, [key]: { predicate, mode } }))
      // Reset to first page when filters change
      setRawPagination((p) => (p ? { ...p, page: 1 } : p))
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setRawFilters({} as Record<string, FilterCriteria<T>>)
    setRawPagination((p) => (p ? { ...p, page: 1 } : p))
  }, [])

  const setSort = useCallback(
    (next: SortConfig<T> | undefined) => setRawSort(next),
    [],
  )
  const setPage = useCallback(
    (page: number) => setRawPagination((p) => (p ? { ...p, page } : p)),
    [],
  )
  const setPageSize = useCallback(
    (pageSize: number) =>
      setRawPagination((p) => (p ? { ...p, pageSize, page: 1 } : p)),
    [],
  )

  return {
    items: paged.items,
    total: paged.total,
    isFiltering,
    filters: rawFilters,
    setFilter,
    clearFilters,
    sortConfig: rawSort,
    setSort,
    pagination: rawPagination,
    setPage,
    setPageSize,
  }
}
