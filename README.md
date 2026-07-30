# RASHINBAN LP (Astro + Sveltia CMS)

[rashinban_lp](../rashinban_lp) のクローン。Parcel + 生HTML から Astro に移行し、
トップページ以外のコンテンツを [Sveltia CMS](https://github.com/sveltia/sveltia-cms) で編集できるようにしたもの。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的サイトを出力
```

## コンテンツ構成

2025年サイトは `/2025/` 以下にアーカイブ済み。ルート `/` は 2026 年サイト用
(`src/pages/index.astro` + `src/layouts/2026/` + `src/styles/2026/`、現状ほぼ空)。
旧URL (`/news/…` など) は `astro.config.mjs` の `redirects` で `/2025/…` へ転送される。

### 2026 (作成中)

| 内容 | 場所 | ページ |
| --- | --- | --- |
| トップページ | `src/pages/index.astro` + `src/layouts/2026/Base.astro` | `/` |
| スタイル | `src/styles/2026/main.less` (新デザイン用・2025とは独立) | - |

### 2025 アーカイブ

| 内容 | 場所 | ページ |
| --- | --- | --- |
| ニュース記事 | `src/content/news2025/*.md` | `/2025/news/<slug>/` + `/2025/news/` 一覧 + 2025トップNEWS欄(最新3件) |
| インタビュー | `src/content/interviews2025/*.md` | `/2025/interviews/<slug>/` |
| 選手 | `src/content/players2025/*.yaml` | `/2025/players/` に一覧表示 |
| 固定ページ | `src/content/pages2025/{about,tournament,tickets,staff}.md` | `/2025/about/` など |
| METAギャラリー | `public/assets/images/meta/` に画像を置くだけ | `/2025/meta/` |
| トップページ | `src/pages/2025/index.astro` + `src/components/2025/sections/` (手書き) | `/2025/` |

ニュース記事は frontmatter の `link` を設定すると記事ページを生成せず、
一覧からそのURLへ直接リンクする（外部リンク告知用）。

## CMS での編集

管理画面は `/admin/`。設定は `public/admin/config.yml`。

### ローカル編集（セットアップ不要）

1. `npm run dev`
2. Chrome/Edge で http://localhost:4321/admin/ を開く
3. 「ローカルリポジトリで作業する」を選び、このリポジトリのフォルダを選択
4. 編集内容はファイルに直接保存されるので、通常どおり git commit & push

### 本番URLからの編集（GitHub OAuth）

GitHub Pages は OAuth トークンハンドラを持てないため、無料の Cloudflare Worker を1つ立てる:

1. [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) を Cloudflare Workers にデプロイ
2. GitHub の OAuth App を作成（callback URL に Worker の `/callback` を指定）し、
   `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` を Worker に設定
3. `public/admin/config.yml` の `backend.base_url` に Worker のURLを設定

### 初回セットアップの TODO

- [ ] GitHub にリポジトリを作成して push
- [ ] `public/admin/config.yml` の `backend.repo` を実際の `owner/repo` に変更
- [ ] リポジトリ Settings → Pages → Source を「GitHub Actions」に変更
- [ ] カスタムドメインを使わない場合（`https://<user>.github.io/<repo>/` 配信）は
      `astro.config.mjs` に `base: '/<repo>'` を追加し、`site` を変更する

## 元サイトとの差分

- posthtml-include → Astro コンポーネント
- ニュース一覧（トップ・/news/）はハードコードではなく news コレクションから自動生成
- META ギャラリーは画像フォルダから自動生成
- LESS・JS（ドロワーナビ、配信タブ切替、締切ツールチップ等）はそのまま移植
