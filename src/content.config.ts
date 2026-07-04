import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Sveltia は未入力の任意フィールドを空文字列で保存するため、undefined に正規化する
const optionalString = z
  .string()
  .optional()
  .transform((v) => v || undefined);

// ニュース記事。link を設定すると記事ページは生成されず、一覧からそのURLへ直接リンクする
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    // 記事ページ冒頭の見出し。未設定なら title を使う。HTML可 (<br/> など)
    headline: optionalString,
    date: z.coerce.date(),
    description: optionalString,
    ogImage: optionalString,
    link: optionalString,
  }),
});

const interviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/interviews' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
    ogImage: optionalString,
  }),
});

const players = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/players' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    photo: z.string(),
    description: z.string(),
    interview: optionalString,
    order: z.number().default(0),
  }),
});

// 固定ページ (about / tournament / tickets / staff など)
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
  }),
});

export const collections = { news, interviews, players, pages };
