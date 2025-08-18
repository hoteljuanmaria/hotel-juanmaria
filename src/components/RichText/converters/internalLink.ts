import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object' || !value) return '#'

  const slug = value?.slug ?? value?.id

  switch (relationTo) {
    case 'posts':
    case 'blog':
    case 'articles':
      return `/blog/${slug}`
    case 'users':
      return `/users/${slug}`
    default:
      return `/${slug}`
  }
}
