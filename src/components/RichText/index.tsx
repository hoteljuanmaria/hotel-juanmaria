'use client'

import React from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import { jsxConverter } from '@/components/RichText/converters'
import { cn } from '@/utilities/ui'

type EditorState = SerializedEditorState | DefaultTypedEditorState | null | undefined

type Props = {
  data: EditorState | string
  enableGutter?: boolean
  enableProse?: boolean
  invertInDark?: boolean
} & React.HTMLAttributes<HTMLDivElement>

/** Fallback muy simple para evitar crashes del renderer */
function SafeRenderer({
  data,
  converters,
}: {
  data: Exclude<EditorState, string>
  converters: any
}) {
  try {
    return <PayloadRichText data={data as any} converters={converters} />
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[RichText] render error:', err, { data })
    }
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
        No se pudo renderizar el contenido.
      </div>
    )
  }
}

export default function RichText(props: Props) {
  const {
    className,
    enableProse = true,
    enableGutter = true,
    invertInDark = true,
    data,
    ...rest
  } = props

  // 1) Parseo seguro si viene stringificado
  const parsed: EditorState =
    typeof data === 'string'
      ? (() => {
          try {
            return JSON.parse(data)
          } catch {
            return null
          }
        })()
      : data

  // 2) Validar forma mínima esperada por Lexical
  const isLexical = parsed && typeof parsed === 'object' && 'root' in (parsed as any)

  if (!isLexical) return null

  return (
    <div
      className={cn(
        'payload-richtext',
        enableGutter ? 'container' : 'max-w-none',
        enableProse && 'mx-auto prose sm:prose-base md:prose-lg',
        invertInDark && enableProse && 'dark:prose-invert',
        className,
      )}
      {...rest}
    >
      <SafeRenderer data={parsed as any} converters={jsxConverter} />
    </div>
  )
}
