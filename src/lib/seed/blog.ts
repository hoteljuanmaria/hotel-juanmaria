import { getPayload } from 'payload'
import configPromise from '@payload-config'

import blogJson from '@/data/blog.json'

type BlogJSON = typeof blogJson

// Convert a subset of Markdown to a Lexical editor state compatible with Payload's RichText
// Supports: headings (#, ##, ###, ####), paragraphs, bullet and ordered lists, blockquotes,
// and basic inline bold/italic. Links will be preserved as plain text.
const markdownToLexical = (markdown: string) => {
  type TextNode = {
    type: 'text'
    text: string
    format: number // bitmask: 1 bold, 2 italic
    detail: number
    mode: 'normal'
    style: string
    version: 1
  }

  const makeTextNodes = (text: string): TextNode[] => {
    const nodes: TextNode[] = []
    let i = 0
    while (i < text.length) {
      // Bold **text**
      if (text.startsWith('**', i)) {
        const end = text.indexOf('**', i + 2)
        if (end > i + 2) {
          const boldText = text.slice(i + 2, end)
          nodes.push({
            type: 'text',
            text: boldText,
            format: 1, // bold
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          })
          i = end + 2
          continue
        }
      }
      // Italic *text*
      if (text[i] === '*' && text[i + 1] !== '*') {
        const end = text.indexOf('*', i + 1)
        if (end > i + 1) {
          const italicText = text.slice(i + 1, end)
          nodes.push({
            type: 'text',
            text: italicText,
            format: 2, // italic
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          })
          i = end + 1
          continue
        }
      }
      // Plain chunk until next *
      const nextStar = text.indexOf('*', i)
      const chunkEnd = nextStar === -1 ? text.length : nextStar
      const chunk = text.slice(i, chunkEnd)
      if (chunk) {
        nodes.push({
          type: 'text',
          text: chunk,
          format: 0,
          detail: 0,
          mode: 'normal',
          style: '',
          version: 1,
        })
      }
      i = chunkEnd
    }
    return nodes
  }

  const makeParagraph = (text: string) => ({
    type: 'paragraph' as const,
    format: 'left',
    indent: 0,
    version: 1 as const,
    children: makeTextNodes(text),
  })

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')

  const children: any[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Blank line: paragraph separator
    if (trimmed === '') {
      i++
      continue
    }

    // Headings
    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2]
      const tag = (
        level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4'
      ) as 'h1' | 'h2' | 'h3' | 'h4'
      children.push({
        type: 'heading',
        tag,
        format: 'left',
        indent: 0,
        version: 1,
        children: makeTextNodes(text),
      })
      i++
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.slice(2)
      children.push({
        type: 'quote',
        format: 'left',
        indent: 0,
        version: 1,
        children: [makeParagraph(quoteText)],
      })
      i++
      continue
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = []
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      children.push({
        type: 'list',
        listType: 'bullet',
        start: 1,
        format: 'left',
        indent: 0,
        version: 1,
        children: items.map((t) => ({
          type: 'listitem',
          version: 1,
          value: 1,
          children: [makeParagraph(t)],
        })),
      })
      continue
    }

    // Ordered list
    const orderedMatch = /^(\d+)\.\s+(.*)$/.exec(trimmed)
    if (orderedMatch) {
      const items: string[] = []
      const start = parseInt(orderedMatch[1], 10)
      items.push(orderedMatch[2])
      i++
      while (i < lines.length) {
        const m = /^(\d+)\.\s+(.*)$/.exec(lines[i].trim())
        if (!m) break
        items.push(m[2])
        i++
      }
      children.push({
        type: 'list',
        listType: 'number',
        start: isNaN(start) ? 1 : start,
        format: 'left',
        indent: 0,
        version: 1,
        children: items.map((t) => ({
          type: 'listitem',
          version: 1,
          value: 1,
          children: [makeParagraph(t)],
        })),
      })
      continue
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      children.push({ type: 'horizontalrule', version: 1 })
      i++
      continue
    }

    // Paragraph (accumulate consecutive non-empty/non-structural lines into one paragraph)
    const paraLines: string[] = [trimmed]
    i++
    while (i < lines.length) {
      const t = lines[i].trim()
      if (
        t === '' ||
        /^(#{1,4})\s+/.test(t) ||
        t.startsWith('> ') ||
        t.startsWith('- ') ||
        t.startsWith('* ') ||
        /^\d+\.\s+/.test(t) ||
        t === '---' ||
        t === '***'
      ) {
        break
      }
      paraLines.push(t)
      i++
    }
    const paragraphText = paraLines.join(' ')
    children.push(makeParagraph(paragraphText))
  }

  return {
    root: {
      type: 'root',
      direction: null as null,
      format: 'left',
      indent: 0,
      version: 1 as const,
      children,
    },
  }
}

// Upsert a Category by slug, returning the document ID
async function upsertCategory({
  slug,
  title,
  color,
}: {
  slug: string
  title: string
  color?: string
}): Promise<string | undefined> {
  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs?.[0]) return existing.docs[0].id as string

  const created = await payload.create({
    collection: 'categories',
    data: {
      title,
      color: color || '#6B7280',
      slug,
      slugLock: true,
    },
  })
  return created.id as string
}

// Create or update a blog post by slug, return its ID
async function upsertBlogPost(
  post: BlogJSON['blog']['posts'][number],
  categoryID?: string,
) {
  const payload = await getPayload({ config: configPromise })

  const tags = (post.tags || []).map((t) => ({ tag: t }))

  const data: Record<string, any> = {
    title: post.title,
    slug: post.slug,
    slugLock: true,
    excerpt: post.excerpt,
    content: markdownToLexical(post.content),
    featured: !!post.featured,
    readTime: post.readTime,
    author: {
      name: post.author?.name,
      role: post.author?.role,
      // avatar: Skipped (requires Media upload)
    },
    tags,
    meta: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      // image: Skipped (requires Media upload)
    },
    publishedAt: post.publishedAt,
    _status: 'published',
  }

  if (categoryID) data.category = categoryID

  const existing = await payload.find({
    collection: 'blogs',
    where: { slug: { equals: post.slug } },
    limit: 1,
  })

  if (existing.docs?.[0]) {
    const updated = await payload.update({
      collection: 'blogs',
      id: existing.docs[0].id,
      data: data as any,
    })
    return updated.id as string
  }

  const created = await payload.create({
    collection: 'blogs',
    data: data as any,
  })
  return created.id as string
}

// Seed Blog collection and BlogPage global using src/data/blog.json
export async function seedBlog() {
  const payload = await getPayload({ config: configPromise })

  const data = blogJson.blog

  // 1) Ensure Categories exist and map by key
  const categoryMap = new Map<string, string>() // key -> categoryID
  if (Array.isArray(data.categories)) {
    for (const cat of data.categories) {
      const slug = cat.id
      const id = await upsertCategory({
        slug,
        title: cat.name,
        color: cat.color,
      })
      if (id) categoryMap.set(slug.toLowerCase(), id)
    }
  }

  // 2) Create/Update Blog posts
  const createdPostIDs: string[] = []
  for (const post of data.posts) {
    const catKey = (post.category || '').toString().toLowerCase()
    const categoryID = categoryMap.get(catKey)
    const id = await upsertBlogPost(post, categoryID)
    createdPostIDs.push(id)
  }

  // 3) Configure BlogPage global
  try {
    // Pick featured posts for the global based on JSON setting
    const featuredCount = Math.max(
      0,
      Math.min(data.settings?.featuredPostsCount || 0, createdPostIDs.length),
    )

    // Fetch featured posts by querying the newly created ones that are marked featured
    const featured = await payload.find({
      collection: 'blogs',
      where: { featured: { equals: true } },
      limit: featuredCount || 10,
    })

    await payload.updateGlobal({
      slug: 'blogPage',
      data: {
        title: 'Blog',
        subtitle: 'Últimas noticias, guías y novedades del Hotel Juan María',
        introduction: markdownToLexical(
          'Descubre artículos, guías y noticias seleccionadas para ti.',
        ) as any,
        featured: {
          enabled: true,
          posts: featured.docs.map((d) => d.id),
        },
        newsletter: data.settings?.enableNewsletter
          ? {
              title: 'Suscríbete a nuestro newsletter',
              description:
                'Recibe las últimas noticias, guías y ofertas exclusivas directamente en tu correo.',
              buttonText: 'Suscribirme',
            }
          : undefined,
        labels: {
          allCategoryLabel: 'Todos',
          readArticle: 'Leer Artículo',
          read: 'Leer',
          subscribeCta: 'Suscribirse al Newsletter',
        },
        meta: {
          title: 'Blog | Hotel Juan María',
          description: 'Artículos y noticias del Hotel Juan María en Tuluá.',
        },
      },
    })
  } catch (err) {
          payload.logger.error(`Failed to update BlogPage global ${err instanceof Error ? err.message : String(err)}`)
      }


  return { count: createdPostIDs.length, posts: createdPostIDs }
}

export default seedBlog
