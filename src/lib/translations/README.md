# Sistema de Traducciones

Este sistema permite traducir fácilmente todos los textos hardcodeados de la aplicación entre español e inglés.

## Cómo usar

### 1. Importar las funciones de traducción

```tsx
import { t, tPlural, type Locale } from '@/lib/translations'
```

### 2. Usar la función `t()` para traducciones simples

```tsx
// En lugar de texto hardcodeado:
<h1>Nuestras Habitaciones</h1>

// Usar:
<h1>{t(locale, 'rooms.title')}</h1>
```

### 3. Usar la función `tPlural()` para pluralización

```tsx
// En lugar de lógica manual:
<span>{count} habitación{count !== 1 ? 'es' : ''} encontrada{count !== 1 ? 's' : ''}</span>

// Usar:
<span>{count} {tPlural(locale, 'rooms.results.found', count)}</span>
```

### 4. Estructura de las traducciones

Las traducciones están organizadas en objetos anidados:

```tsx
translations = {
  es: {
    rooms: {
      title: 'Nuestras Habitaciones',
      filters: {
        minPrice: 'Precio mínimo',
        maxPrice: 'Precio máximo'
      }
    }
  },
  en: {
    rooms: {
      title: 'Our Rooms',
      filters: {
        minPrice: 'Minimum price',
        maxPrice: 'Maximum price'
      }
    }
  }
}
```

### 5. Acceder a traducciones anidadas

```tsx
// Para acceder a 'rooms.filters.minPrice':
t(locale, 'rooms.filters.minPrice')
```

## Agregar nuevas traducciones

### 1. Agregar al archivo `src/lib/translations.ts`

```tsx
export const translations = {
  es: {
    // ... traducciones existentes
    newSection: {
      title: 'Nuevo Título',
      description: 'Nueva descripción'
    }
  },
  en: {
    // ... traducciones existentes
    newSection: {
      title: 'New Title',
      description: 'New description'
    }
  }
}
```

### 2. Usar en el componente

```tsx
<h1>{t(locale, 'newSection.title')}</h1>
<p>{t(locale, 'newSection.description')}</p>
```

## Ventajas del sistema

- **Fácil mantenimiento**: Todas las traducciones están en un solo lugar
- **Consistencia**: Mismo texto en toda la aplicación
- **Escalabilidad**: Fácil agregar nuevos idiomas
- **Fallback**: Si no encuentra una traducción, usa español por defecto
- **Type safety**: TypeScript detecta errores en las claves de traducción

## Ejemplos de uso

### Botones
```tsx
<button>{t(locale, 'rooms.room.book')}</button>
```

### Placeholders
```tsx
<input placeholder={t(locale, 'rooms.searchPlaceholder')} />
```

### Labels
```tsx
<label>{t(locale, 'rooms.filters.minPrice')}</label>
```

### Mensajes de error
```tsx
<p>{t(locale, 'rooms.noResults')}</p>
```

## Notas importantes

- Siempre usar `t(locale, 'key')` en lugar de texto hardcodeado
- Para pluralización, usar `tPlural(locale, 'key', count)`
- El locale debe ser de tipo `'es' | 'en'` (no `'all'`)
- Si se usa `'all'`, crear una función helper que lo convierta a `'es'`
