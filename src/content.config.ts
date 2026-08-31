import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Sveltia は未入力の任意フィールドを空文字列 (relation ウィジェットは null) で保存するため、
// undefined に正規化する
const optionalString = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v || undefined);

// 2026年のニュース記事 (トップの NEWS 欄に表示。記事ページ・一覧ページは未実装)
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    headline: optionalString,
    date: z.coerce.date(),
    description: optionalString,
    ogImage: optionalString,
    link: optionalString,
  }),
});

// 2026年の FAQ (トップの FAQ セクションに表示順で表示)
const faq = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().default(0),
  }),
});

// 2026年の固定ページ (ABOUT / PLAYERS GUIDE / SPECTATOR GUIDE)。
// セクションをブロック単位で組み立てる (Sveltia の types 付き list ウィジェットに対応)
const guideSection = z.discriminatedUnion('type', [
  // 見出し + 本文 (+ 枠囲みの注意書き / 画像)
  z.object({
    type: z.literal('text'),
    headingEn: z.string(),
    headingJa: optionalString,
    notice: optionalString,
    body: optionalString,
    image: optionalString,
  }),
  // 開催日 (日付バッジ + 説明)
  z.object({
    type: z.literal('gameday'),
    headingEn: z.string(),
    headingJa: optionalString,
    days: z.array(
      z.object({
        label: z.string(),
        date: z.string(),
        dow: z.string(),
        description: optionalString,
        note: optionalString,
      })
    ),
  }),
  // 会場 (写真 + 情報 + Google Maps)
  z.object({
    type: z.literal('venue'),
    headingEn: z.string(),
    headingJa: optionalString,
    name: z.string(),
    address: optionalString,
    access: optionalString,
    mapsUrl: optionalString,
    photo: optionalString,
  }),
  // チケット一覧 (白帯の価格バー)。
  // onSale=false の間は全体をグレーアウトして saleStartText を重ねる。
  // 販売中は各バーが url へのリンクになり、soldOut のバーは SOLD OUT 表示になる
  z.object({
    type: z.literal('tickets'),
    headingEn: z.string(),
    headingJa: optionalString,
    intro: optionalString,
    onSale: z.boolean().default(false),
    saleStartText: optionalString,
    url: optionalString,
    items: z.array(
      z.object({
        label: z.string(),
        price: z.string(),
        soldOut: z.boolean().default(false),
        features: z.array(z.string()).default([]),
        separatorAbove: z.boolean().default(false),
      })
    ),
    notes: optionalString,
  }),
  // 支援プログラムの仕組み (/patron の HOW THE PROGRAM WORKS)。
  // 申し込み種別 (①②③) ごとに 小見出し / リード文 / 申請フォームの白帯リンク / 本文 / 支援フロー
  z.object({
    type: z.literal('program'),
    headingEn: z.string(),
    headingJa: optionalString,
    items: z.array(
      z.object({
        title: z.string(),
        lead: optionalString,
        formLabel: optionalString,
        formUrl: optionalString,
        body: optionalString,
        flowLabel: optionalString,
        flow: z
          .array(
            z.object({
              icon: z.enum(['person', 'match', 'chat', 'money']).default('person'),
              title: z.string(),
              note: optionalString,
            })
          )
          .default([]),
      })
    ),
  }),
  // 申請選手一覧 (/patron の PLAYER APPLICATIONS)。players コレクションをカードで並べる
  z.object({
    type: z.literal('applications'),
    headingEn: z.string(),
    headingJa: optionalString,
    intro: optionalString,
    emptyText: optionalString,
  }),
  // ご支援者一覧 (/patron の SUPPORTERS)。supporters コレクションを個人協賛 / 選手指名支援に分けて並べる
  z.object({
    type: z.literal('supporters'),
    headingEn: z.string(),
    headingJa: optionalString,
    intro: optionalString,
    generalLabel: z.string().default('個人協賛'),
    designatedLabel: z.string().default('選手指名支援'),
  }),
]);

const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
    sections: z.array(guideSection),
  }),
});

// マークダウンだけの固定ページ (プライバシーポリシーなど)。
// pages と同じフォルダに .md で置くと同じ見た目のページになる
const pagesMd = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
  }),
});

// 支援プログラムに申請した選手 (/patron の PLAYER APPLICATIONS に表示)
const players = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/players' }),
  schema: z.object({
    name: z.string(),
    geoguessrUrl: optionalString,
    rating: z.number(),
    comment: optionalString,
    // 支援成立: カードをグレーアウトして「支援成立 (支援者名)」を重ねる
    supported: z.boolean().default(false),
    supporter: optionalString,
  }),
});

// ご支援者 (/patron の SUPPORTERS に表示)。
// player は指名した選手の名前 (players の name)。空なら個人協賛、入っていれば選手指名支援
const supporters = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/supporters' }),
  schema: z.object({
    name: z.string(),
    player: optionalString,
  }),
});

// ニュース記事。link を設定すると記事ページは生成されず、一覧からそのURLへ直接リンクする
const news2025 = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news2025' }),
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

const interviews2025 = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/interviews2025' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
    ogImage: optionalString,
  }),
});

const players2025 = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/players2025' }),
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
const pages2025 = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages2025' }),
  schema: z.object({
    title: z.string(),
    description: optionalString,
  }),
});

export const collections = {
  news,
  faq,
  pages,
  pagesMd,
  players,
  supporters,
  news2025,
  interviews2025,
  players2025,
  pages2025,
};
