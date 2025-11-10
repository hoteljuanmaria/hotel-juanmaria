import type {
    DefaultNodeTypes,
    SerializedBlockNode,
  } from '@payloadcms/richtext-lexical'
  import {
    JSXConvertersFunction,
    LinkJSXConverter,
  } from '@payloadcms/richtext-lexical/react'
  
  import type {
    BannerBlock as BannerBlockProps,
    CallToActionBlock as CTABlockProps,
    MediaBlock as MediaBlockProps,
  } from '@/payload-types'
  
  import { BannerBlock } from '@/blocks/Banner/Component'
  import { CallToActionBlock } from '@/blocks/CallToAction/Component'
  import { MediaBlock } from '@/blocks/MediaBlock/Component'
  import { CodeBlock, type CodeBlockProps } from '@/blocks/Code/Component'
  
  import { internalDocToHref } from './internalLink'
  import { headingConverter } from './headingConverter'
  
  type NodeTypes =
    | DefaultNodeTypes
    | SerializedBlockNode<
        CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps
      >
  
  export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    ...headingConverter, // 👈 IMPORTANTE: mete esto acá
    blocks: {
      banner: ({ node }) => (
        <BannerBlock className="mb-6" {...node.fields} />
      ),
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="my-6"
          imgClassName="m-0"
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer
          {...node.fields}
        />
      ),
      code: ({ node }) => <CodeBlock className="my-4" {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  })
  