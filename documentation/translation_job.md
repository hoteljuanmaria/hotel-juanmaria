# Automatic Translation System (Optimized)

Este sistema implementa traducción automática de español (es) a inglés (en) utilizando la API de DeepL y el sistema de jobs de Payload CMS.

## ✨ Nuevas Optimizaciones (v2.0)

### Performance Improvements
- **🚀 Batch Processing**: Los campos se traducen en lotes para reducir llamadas a API
- **💾 Sistema de Cache**: Cache inteligente de traducciones con TTL configurable  
- **⚡ Lazy Loading**: TranslationService se inicializa solo cuando se necesita
- **🔄 Retry Logic**: Sistema de reintentos con backoff exponencial
- **📊 Database Optimization**: Queries paralelas y optimización de fetching

### Code Quality
- **🔧 Hook Reutilizable**: `createTranslationHook()` elimina duplicación de código
- **⚙️ Configuración Centralizada**: Todas las configuraciones en `/config/translation-config.ts`
- **📝 Mejor Logging**: Logging estructurado con contexto
- **🛡️ Error Handling Robusto**: Manejo de errores más resiliente

### Architecture
- **🏗️ Modular Design**: Separación clara de responsabilidades
- **🔌 Extensible**: Fácil agregar nuevos idiomas y colecciones
- **📋 Type Safety**: Tipos TypeScript mejorados

## Configuración

### 1. Variables de Entorno

Agrega la siguiente variable a tu archivo `.env.local`:

```bash
DEEPL_API_KEY=your-deepl-api-key-here
```

Para obtener una API key gratuita de DeepL:
1. Ve a [DeepL Pro API](https://www.deepl.com/pro-api)
2. Regístrate para una cuenta gratuita (500,000 caracteres/mes)
3. Obtén tu API key del panel de control

### 2. Configuración de Colecciones

Para habilitar traducción automática en una colección, necesitas:

#### A. Agregar campos localizados

```typescript
// En tu colección
fields: [
  {
    name: 'title',
    type: 'text',
    localized: true, // ← Esto habilita la localización
  },
  {
    name: 'content',
    type: 'richText',
    localized: true, // ← También funciona con rich text
    editor: lexicalEditor(),
  },
]
```

#### B. Usar el Hook Optimizado (NUEVO ✨)

```typescript
import { translationHooks } from '../lib/hooks/translation-hook'

// En tu colección
hooks: {
  afterChange: [
    // Opción 1: Hook predefinido ES → EN (Recomendado)
    translationHooks.collection.esToEn,

    O SI NO 

    translationHooks.global.esToEn,
    
    // Opción 2: Hook personalizado
    translationHooks.custom({
      sourceLocale: 'es',
      targetLocale: 'en',
      onlyOnCreate: false, // true si solo quieres traducir al crear
    }),
  ],
},
```

#### B.2. Hook Manual (Método Antiguo - ⚠️ Depreciado)

```typescript
// ⚠️ DEPRECIADO: Usar el hook optimizado arriba en su lugar
hooks: {
  afterChange: [
    async ({ doc, req, operation }) => {
      if (operation === 'create' || operation === 'update') {
        const currentLocale = req.locale || 'es'
        
        if (currentLocale === 'es') {
          try {
            await req.payload.jobs.queue({
              task: 'translate-content',
              input: {
                collection: 'tu-coleccion',
                docId: doc.id,
                locale: 'es',
                targetLocale: 'en',
              },
            })
          } catch (error) {
            console.error('Failed to queue translation job:', error)
          }
        }
      }
    },
  ],
},
```

## Cómo Funciona

1. **Trigger**: Cuando se guarda contenido en español (`es`), el hook `afterChange` se ejecuta
2. **Queue**: Se encola un job de traducción en segundo plano
3. **Processing**: El job se procesa usando DeepL API para traducir todos los campos localizados
4. **Update**: El contenido traducido se guarda automáticamente en el locale inglés (`en`)

### Estructura de Datos Localizados

Cuando un campo tiene `localized: true`, Payload almacena los datos así:

```javascript
// Campo no localizado
{
  title: "Mi título"
}

// Campo localizado
{
  title: {
    es: "Mi título en español",
    en: "My title in English"
  }
}
```

El sistema de traducción detecta automáticamente esta estructura y traduce del locale fuente al objetivo.

## Procesamiento de Jobs

### Desarrollo

En desarrollo, los jobs se pueden procesar de las siguientes maneras:

#### Opción 1: API Endpoint (Recomendado)
```bash
# Iniciar el servidor de desarrollo
pnpm dev

# En otra terminal o navegador, hacer una petición a:
curl http://localhost:3000/api/run-translation-jobs
# o visitar http://localhost:3000/api/run-translation-jobs en el navegador
```

#### Opción 2: Script standalone (Puede tener problemas de variables de entorno)
```bash
# Procesar jobs de traducción pendientes
pnpm tsx src/lib/run-translation-jobs.ts
```

**Nota**: Si el script standalone da errores de "missing secret key", usar la opción 1 (API endpoint).

### Producción (Vercel)

El sistema está configurado para usar Vercel Cron Jobs. Los jobs se procesan automáticamente en el endpoint:
- `/api/payload-jobs/run`

## Campos Soportados

El sistema traduce automáticamente los siguientes tipos de campos cuando tienen `localized: true`:

- `text` - Texto simple
- `textarea` - Texto largo
- `richText` - Contenido rich text (Lexical editor)

### Campos Anidados

También funciona con campos anidados:
- `group` - Campos agrupados
- `array` - Arrays de campos
- `blocks` - Layout builder blocks
- `tabs` - Campos en tabs

## Características

- ✅ **No bloquea**: La traducción ocurre en segundo plano
- ✅ **Resiliente**: Sistema de reintentos automático
- ✅ **Preciso**: Usa DeepL para mejor calidad de traducción
- ✅ **Flexible**: Solo traduce campos que no tienen contenido en inglés
- ✅ **Compatible con Vercel**: Funciona en serverless
- ✅ **Mapeo automático**: Convierte códigos de Payload (`en`) a códigos DeepL (`en-US`) automáticamente

## Ejemplo de Uso

```typescript
// collections/Posts.ts
export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      editor: lexicalEditor(),
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const currentLocale = req.locale || 'es'
          
          if (currentLocale === 'es') {
            try {
              await req.payload.jobs.queue({
                task: 'translate-content',
                input: {
                  collection: 'posts',
                  docId: doc.id,
                  locale: 'es',
                  targetLocale: 'en',
                },
              })
            } catch (error) {
              console.error('Failed to queue translation job:', error)
            }
          }
        }
      },
    ],
  },
}
```

## Limitaciones

1. **Solo ES → EN**: Actualmente configurado para traducir de español a inglés
2. **DeepL API Limits**: Cuenta gratuita tiene límite de 500,000 caracteres/mes
3. **Rich Text**: Solo funciona con Lexical editor (formato específico)

## Troubleshooting

### Jobs no se procesan
1. Verifica que `DEEPL_API_KEY` esté configurado
2. Revisa los logs de la consola para errores
3. En desarrollo, procesa jobs manualmente

### Traducción no aparece
1. Verifica que los campos tengan `localized: true`
2. Asegúrate que el hook esté agregado a la colección
3. Revisa que se está guardando en locale 'es'

### Error de API
1. Verifica que la API key de DeepL sea válida
2. Revisa límites de uso en tu cuenta de DeepL
3. Revisa logs de errores en la consola