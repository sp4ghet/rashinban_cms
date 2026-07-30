# 2026年トップページ新設 & 2025年サイトの /2025 アーカイブ化

日付: 2026-07-31

## 目的

- 2025年大会サイト全体を `cms.rashinban.org/2025/` 以下に退避（アーカイブ）する
- ルート `/` を 2026 年ページ用のまっさらな土台にする（デザインは全面刷新予定のため、スタイルシートも新規）

## ルーティング / ファイル移動

2025 のページは `src/pages/2025/` 以下へ移動:

| 旧URL | 新URL |
| --- | --- |
| `/` | `/2025/` |
| `/news/`, `/news/<slug>/` | `/2025/news/…` |
| `/interviews/<slug>/` | `/2025/interviews/…` |
| `/players/` | `/2025/players/` |
| `/meta/` | `/2025/meta/` |
| `/about/` `/tournament/` `/tickets/` `/staff/` | `/2025/…` |

2025 専用のレイアウト・コンポーネントも年スコープへ移動:

- `src/layouts/2025/{Base,Article}.astro`
- `src/components/2025/{Nav,Footer,NewsList,sections/*}.astro`

Nav / Footer / 各セクション内の内部リンクは `/2025/` プレフィックスを付け、
アーカイブ内で完結してナビゲーションできるようにする。`/admin` は現状のまま。

## 2026 トップページ

- `src/pages/index.astro`: 完全に空の `<main>`(truly blank)。ここからデザインを作り込む
- `src/layouts/2026/Base.astro`: 2026 用メタタグ・OG・「rashinban.org 以外は noindex」ロジックを持つ最小レイアウト
- `src/styles/2026/main.less`: 新規（空に近い）スタイルシート。2025 の LESS は一切 import しない
- 2026 用アセットは今後 `public/assets/2026/` に置く。既存アセットは移動しない

## コンテンツコレクション

フォルダ・コレクション名を年スコープ化:

- `src/content/news2025/` `interviews2025/` `players2025/` `pages2025/`
- `src/content.config.ts` のコレクション名も `news2025` などにリネーム
- 2026 用に `news` `players` などの無印名を温存

## Sveltia CMS

- `public/admin/config.yml` の `folder:` を `*2025` パスに更新、ラベルに「(2025)」を付ける
- アーカイブは誤字修正などのため編集可能のまま残す
- プレビューCSS生成の仕組みは変更なし

## リダイレクト

`astro.config.mjs` の `redirects` で旧URLを新URLへ(meta-refresh スタブ生成):

- 動的: `/news/[slug]` → `/2025/news/[slug]`、`/interviews/[slug]` → `/2025/interviews/[slug]`
- 静的: `/news` `/players` `/meta` `/about` `/tournament` `/tickets` `/staff` → `/2025/…`

2026 のニュースが `/news/` で始まる際は静的な `/news` リダイレクトのみ外す
(スラッグは年で異なるため per-slug リダイレクトは残せる)。

## 検証

- `npm run build` 後、`dist/` を確認:
  - ルート `index.html` が空の2026ページ
  - `dist/2025/**` にアーカイブ一式
  - 旧パスにリダイレクトスタブ
  - `/admin` が生きている
- `npm run dev` で目視確認
