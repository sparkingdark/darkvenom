// @flow
import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGFM from 'remark-gfm'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import remarkRehype from 'remark-rehype'
import rehypePrism from '@mapbox/rehype-prism'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeAutoLinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import rehypeMinify from 'rehype-preset-minify'

import { type Post, type PostPreview, transformPost } from './mutators'

const POSTS_DIRECTORY: string = join(process.cwd(), 'src/posts')

export const getPostSlugs = (): Array<string> => fs.readdirSync(POSTS_DIRECTORY)
  .map((post: string) => post.replace('.md', ''))

export const fetchPost = async (slug: string): Promise<Post> => {
  const post = fs.readFileSync(join(POSTS_DIRECTORY, `${slug}.md`), 'utf8')
  const { data, content } = matter(post)
  const html = await unified()
    .use(remarkParse)
    .use(remarkGFM)
    .use(remarkSlug)
    .use(remarkToc, { tight: true, maxDepth: 4 })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(
      rehypeAutoLinkHeadings,
      {
        content: {
          type: 'element',
          tagName: 'span',
          properties: { className: 'headingLink ' },
          children: [{ type: 'text', value: '#' }]
        }
      }
    )
    .use(rehypeExternalLinks)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeMinify)
    .process(content)

  return transformPost({ data, html, slug })
}

export const fetchPosts = async (): Promise<Array<PostPreview>> => {
  const posts: Array<Post> = await Promise.all(
    getPostSlugs().map((slug) => fetchPost(slug))
  )

  return posts
    .sort((x, y) => {
      return new Date(y.datePublished.value) - new Date(x.datePublished.value)
    })
    .map((post) => ({
      datePublished: post.datePublished,
      excerpt: post.excerpt,
      images: post.images,
      slug: post.slug,
      title: post.title
    }))
}
