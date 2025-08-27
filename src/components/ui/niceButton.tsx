import React from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  showIndicator?: boolean // Nueva prop para el círculo
}

// Helper function to safely render children
const renderChildren = (children: React.ReactNode): React.ReactNode => {
  if (
    typeof children === 'object' &&
    children !== null &&
    !React.isValidElement(children)
  ) {
    // Check if it's a localized object with language keys
    const obj = children as any
    if (obj.en || obj.es) {
      // Return the Spanish version by default, fallback to English
      return obj.es || obj.en || ''
    }
    // If it's some other object, try to stringify it safely
    try {
      return JSON.stringify(children)
    } catch {
      return ''
    }
  }
  return children
}

export const NiceButton: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  showIndicator = false, // Por defecto false
}) => {
  const baseClasses =
    'relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  }

  const variantClasses = {
    primary: `
      text-white hover:scale-105 hover:-translate-y-1
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-gray-800 before:to-black
      after:absolute after:inset-0 after:bg-gradient-to-tr after:from-transparent after:via-white/10 after:to-transparent
      after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-700
    `,
    secondary: `
      text-gray-700 hover:text-gray-900 border border-gray-200/60 hover:border-gray-300
      transition-all duration-500 hover:scale-105 backdrop-blur-sm
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-gray-50/0 before:via-gray-100/40 before:to-gray-50/0
      before:transform before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-700 before:origin-center
      after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-white/30 after:to-transparent
      after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500
    `,
    ghost: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-50/60
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-gray-100/30 before:to-transparent
      before:transform before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-500
    `,
  }

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  const content = (
    <>
      <span className='relative z-10 flex items-center justify-center'>
        {renderChildren(children)}
        {/* Solo mostrar el círculo si showIndicator es true y es variant primary */}
        {variant === 'primary' && showIndicator && (
          <div className='ml-2 w-2 h-2 bg-white/70 rounded-full group-hover:bg-white transition-colors duration-300'></div>
        )}
      </span>
      {variant === 'primary' && (
        <>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transform scale-0 group-hover:scale-100 transition-transform duration-700 rounded-lg'></div>
          <div className='absolute inset-0 border border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
        </>
      )}
      {/* Shimmer effect for all variants */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
        <div className='absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse'></div>
        <div
          className='absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
          style={{ animationDelay: '0.3s' }}
        ></div>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  )
}

// Componente específico para enlaces de navegación
interface NavLinkProps {
  children: React.ReactNode
  href: string
  active?: boolean
  className?: string
}

export const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  active = false,
  className = '',
}) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center px-6 py-3 text-sm font-medium text-gray-700
        transition-all duration-500 relative overflow-hidden group
        hover:text-gray-900 ${active ? 'text-gray-900' : ''} ${className}
      `}
    >
      <span className='relative z-20 flex items-center'>
        {renderChildren(children)}
      </span>

      {/* Morphing background effect */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-100/40 rounded-lg transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out'></div>
        <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-gray-100/30 to-transparent rounded-lg transform rotate-45 scale-0 group-hover:scale-150 transition-all duration-1000 ease-out'></div>
      </div>

      {/* Flowing underline */}
      <div className='absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-all duration-700 ease-out w-3/4'></div>

      {/* Shimmer crystals */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
        <div className='absolute top-2 left-3 w-1 h-4 bg-gradient-to-b from-transparent via-gray-300 to-transparent rotate-45 animate-pulse'></div>
        <div
          className='absolute top-4 right-4 w-3 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-pulse'
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className='absolute bottom-2 left-6 w-2 h-2 bg-gradient-to-br from-gray-200 via-gray-300 to-transparent rotate-12 animate-pulse'
          style={{ animationDelay: '0.7s' }}
        ></div>
      </div>

      {active && (
        <div className='absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent transform -translate-x-1/2 w-3/4'></div>
      )}
    </Link>
  )
}

// Componente para cards con glassmorphism
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  return (
    <div
      className={`
      relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20
      overflow-hidden transition-all duration-700
      ${hover ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-3xl' : ''}
      ${className}
    `}
    >
      {children}
      {hover && (
        <>
          {/* Floating highlight */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700'></div>
          {/* Shimmer effect */}
          <div className='absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700'>
            <div className='absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse'></div>
            <div
              className='absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse'
              style={{ animationDelay: '0.5s' }}
            ></div>
          </div>
        </>
      )}
    </div>
  )
}

// Componente para inputs con el mismo estilo
interface InputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'textarea'
  value?: string
  onChange?: (value: string) => void
  className?: string
  required?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  className = '',
  required = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange?.(e.target.value)
  }

  const inputClasses = `
    w-full px-4 py-3 bg-white/70 backdrop-blur-xl border border-gray-200/60
    rounded-lg text-gray-900 placeholder-gray-500
    focus:outline-none focus:border-gray-400 focus:bg-white/90
    transition-all duration-500 hover:border-gray-300
    ${className}
  `

  return (
    <div className='relative group'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          rows={4}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          className={inputClasses}
        />
      )}
      {/* Floating focus indicator */}
      <div className='absolute inset-0 border border-gray-400 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
    </div>
  )
}
