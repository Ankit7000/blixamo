import type { MDXComponents } from 'mdx/types'
import { Callout } from './components/blog/Callout'
import { ArticleImage, ArticleTable, ProsCons, VerdictBox, VisualBlock } from './components/blog/MdxVisuals'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    img: ArticleImage,
    table: ArticleTable,
    VisualBlock,
    ProsCons,
    VerdictBox,
    ...components,
  }
}
