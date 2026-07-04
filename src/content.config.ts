import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ニュース記事。link を設定すると記事ページは生成されず、一覧からそのURLへ直接リンクする
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    link: z.string().optional(),
  }),
});

const interviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/interviews' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }),
});

const players = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/players' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string(),
    description: z.string(),
    interview: z.string().optional(),
    order: z.number().default(0),
  }),
});

// 固定ページ (about / tournament / tickets / staff など)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { news, interviews, players, pages };
