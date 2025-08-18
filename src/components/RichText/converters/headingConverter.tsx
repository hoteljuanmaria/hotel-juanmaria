import { JSXConverters } from '@payloadcms/richtext-lexical/react'
import { SerializedHeadingNode } from '@payloadcms/richtext-lexical'
import { JSX } from 'react'

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag as keyof JSX.IntrinsicElements
    const children = nodesToJSX({ nodes: node.children })
    const plain = children.join('')

    // Tamaños y estilos por nivel (sobre-escriben los de .prose)
    const size =
      node.tag === 'h1' ? 'text-3xl md:text-5xl'
      : node.tag === 'h2' ? 'text-2xl md:text-3xl'
      : node.tag === 'h3' ? 'text-xl md:text-2xl'
      : node.tag === 'h4' ? 'text-lg md:text-xl'
      : node.tag === 'h5' ? 'text-base md:text-lg'
      : 'text-base'

    // ids útiles para anclas (en h1/h2)
    const id = (node.tag === 'h1' || node.tag === 'h2') ? slugify(plain) : undefined

    return (
      <Tag
        id={id}
        className={`${size} font-bold leading-tight mt-10 mb-5`}
      >
        {children}
      </Tag>
    )
  },
}
