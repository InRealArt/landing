'use client'

import { useState, useRef, useEffect, useId, useCallback } from 'react'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  id?: string
  name?: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  required?: boolean
  className?: string
}

export default function Combobox({
  id,
  name,
  options,
  value,
  onChange,
  placeholder = '—',
  searchPlaceholder = '',
  required,
  className = '',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const uid = useId()
  const listboxId = `${uid}-listbox`
  const searchId = `${uid}-search`

  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find(o => o.value === value) ?? null

  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Auto-focus search input when opening
  useEffect(() => {
    if (open) {
      // Defer to allow the panel to mount/paint first
      const raf = requestAnimationFrame(() => {
        searchRef.current?.focus()
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setQuery('')
      setActiveIndex(-1)
    }
  }, [open])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleToggle = () => setOpen(prev => !prev)

  const handleSelect = useCallback((optionValue: string) => {
    onChange(optionValue)
    setOpen(false)
  }, [onChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleSelect(filtered[activeIndex].value)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative${className ? ` ${className}` : ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden native input keeps the value in the form submit payload */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required}
          aria-hidden="true"
        />
      )}

      {/* Trigger */}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-required={required}
        onClick={handleToggle}
        className="w-full flex items-center justify-between bg-transparent border-0 border-b border-borderColor py-3 text-[0.85rem] text-left focus:outline-none focus:border-textColor transition-colors duration-300 cursor-pointer"
      >
        <span className={selectedOption ? 'text-textColor' : 'text-grayText'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {/* Chevron */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`w-3.5 h-3.5 text-grayText pointer-events-none flex-shrink-0 transition-transform duration-200${open ? ' rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full z-50 bg-backgroundColor border border-borderColor shadow-sm"
          style={{ marginTop: 0 }}
        >
          {/* Search input */}
          <div className="border-b border-borderColor">
            <input
              ref={searchRef}
              id={searchId}
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent px-4 py-3 text-[0.85rem] text-textColor placeholder:text-grayText focus:outline-none"
              aria-label={searchPlaceholder}
              autoComplete="off"
            />
          </div>

          {/* Options list */}
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            className="max-h-[260px] overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-[0.85rem] text-grayText select-none">
                —
              </li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option.value === value
                const isActive = index === activeIndex
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center justify-between px-4 py-3 text-[0.85rem] text-textColor cursor-pointer transition-colors duration-150 select-none${isActive ? ' bg-backgroundGrey' : ''}${isSelected && !isActive ? ' bg-backgroundGrey' : ''}`}
                  >
                    <span>{option.label}</span>
                    {/* Checkmark — gold, only on selected option */}
                    {isSelected && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: 'var(--gold-accent)' }}
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
