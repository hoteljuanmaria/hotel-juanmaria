import React from 'react'

// Componente para el degradado premium del newsletter
interface PremiumGradientProps {
  children: React.ReactNode
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const PremiumGradient: React.FC<PremiumGradientProps> = ({
  children,
  className = '',
  rounded = 'xl',
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`bg-gradient-to-r from-gray-900 via-gray-800 to-black ${roundedClasses[rounded]} ${className}`}
    >
      {children}
    </div>
  )
}

// Versión más sutil del degradado
export const SoftGradient: React.FC<PremiumGradientProps> = ({
  children,
  className = '',
  rounded = 'xl',
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800 ${roundedClasses[rounded]} ${className}`}
    >
      {children}
    </div>
  )
}

// Degradado invertido (claro a oscuro)
export const InverseGradient: React.FC<PremiumGradientProps> = ({
  children,
  className = '',
  rounded = 'xl',
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={`bg-gradient-to-r from-black via-gray-800 to-gray-900 ${roundedClasses[rounded]} ${className}`}
    >
      {children}
    </div>
  )
}

// Clases CSS reutilizables como string (para usar directamente en className)
export const gradientClasses = {
  // El degradado que te encanta del newsletter
  premium: 'bg-gradient-to-r from-gray-900 via-gray-800 to-black',

  // Variaciones del mismo estilo
  premiumDiagonal: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
  premiumVertical: 'bg-gradient-to-b from-gray-900 via-gray-800 to-black',

  // Versiones más suaves
  soft: 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-800',
  softDiagonal: 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800',

  // Versiones invertidas
  inverse: 'bg-gradient-to-r from-black via-gray-800 to-gray-900',
  inverseDiagonal: 'bg-gradient-to-br from-black via-gray-800 to-gray-900',

  // Degradados más sutiles para backgrounds
  subtle: 'bg-gradient-to-r from-gray-50 via-white to-gray-100',
  subtleGray: 'bg-gradient-to-br from-gray-100 via-gray-50 to-white',

  // Para overlays
  overlay: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
  overlayBottom: 'bg-gradient-to-b from-transparent via-black/20 to-black/60',
}

// Hook para usar degradados dinámicamente
export const useGradient = (type: keyof typeof gradientClasses) => {
  return gradientClasses[type]
}

// Componente para crear secciones con el degradado premium
interface PremiumSectionProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  textColor?: 'white' | 'gray'
}

export const PremiumSection: React.FC<PremiumSectionProps> = ({
  children,
  className = '',
  padding = 'lg',
  textColor = 'white',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  }

  const textClasses = {
    white: 'text-white',
    gray: 'text-gray-100',
  }

  return (
    <PremiumGradient
      className={`${paddingClasses[padding]} ${textClasses[textColor]} relative overflow-hidden ${className}`}
    >
      {children}
      {/* Efecto de brillo sutil */}
      <div className='absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-50'></div>
    </PremiumGradient>
  )
}

// Ejemplos de uso:
/*
// Como componente:
<PremiumGradient className="p-8">
  <h2>Título con degradado premium</h2>
</PremiumGradient>

// Como clase:
<div className={`${gradientClasses.premium} p-8 rounded-xl`}>
  Contenido
</div>

// Con el hook:
const gradient = useGradient('premium');
<div className={`${gradient} p-8`}>Contenido</div>

// Sección completa:
<PremiumSection padding="xl">
  <h2>Newsletter</h2>
  <p>Contenido</p>
</PremiumSection>
*/
