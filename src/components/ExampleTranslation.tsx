import React from 'react'
import { t, type Locale } from '@/lib/translations'

interface ExampleTranslationProps {
  locale: Locale
}

/**
 * Ejemplo de cómo usar el sistema de traducciones
 * 
 * Este componente muestra las mejores prácticas para implementar
 * traducciones en componentes React
 */
const ExampleTranslation: React.FC<ExampleTranslationProps> = ({ locale }) => {
  // Helper function para manejar locale 'all'
  const getValidLocale = (loc: Locale): 'es' | 'en' => {
    return loc === 'all' ? 'es' : loc
  }

  const validLocale = getValidLocale(locale)

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {t(validLocale, 'rooms.title')}
      </h2>
      
      <p className="text-gray-600 mb-4">
        {t(validLocale, 'rooms.subtitle')}
      </p>

      {/* Ejemplo de filtros */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(validLocale, 'rooms.filters.minPrice')}
          </label>
          <input
            type="number"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t(validLocale, 'rooms.filters.maxPrice')}
          </label>
          <input
            type="number"
            placeholder="999999"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Ejemplo de botones */}
      <div className="flex gap-3 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {t(validLocale, 'rooms.room.viewDetails')}
        </button>
        
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          {t(validLocale, 'rooms.room.book')}
        </button>
      </div>

      {/* Ejemplo de mensaje de estado */}
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-600">
          {t(validLocale, 'rooms.noResults')}
        </p>
      </div>

      {/* Información del locale actual */}
      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Locale actual:</strong> {validLocale}
        </p>
        <p className="text-sm text-blue-600">
          <strong>Locale original:</strong> {locale}
        </p>
      </div>
    </div>
  )
}

export default ExampleTranslation
