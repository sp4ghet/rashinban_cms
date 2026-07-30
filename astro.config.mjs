// @ts-check
import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import less from 'less';

// Sveltia CMS のプレビュー用CSSを dev/build 両方で自動生成する
// (どの経路で astro が起動されても public/admin/preview.css が存在するように)
const cmsPreviewCss = () => ({
  name: 'cms-preview-css',
  hooks: {
    'astro:config:setup': async () => {
      const file = 'src/styles/cms-preview.less';
      const { css } = await less.render(fs.readFileSync(file, 'utf8'), { filename: file });
      fs.writeFileSync('public/admin/preview.css', css);
    },
  },
});

export default defineConfig({
  // publish ワークフローが本番URL (https://rashinban.org) を SITE で注入する
  site: process.env.SITE ?? 'https://cms.rashinban.org',
  trailingSlash: 'ignore',
  // 2025年サイトは /2025/ 以下にアーカイブ。旧URLへのリンクが外部に残っているため
  // meta-refresh スタブでリダイレクトする。2026年のニュースを /news/ で始めるときは
  // 静的な '/news' の行だけ外す (スラッグは年で異なるので動的リダイレクトは残せる)
  redirects: {
    '/news': '/2025/news',
    '/news/[slug]': '/2025/news/[slug]',
    '/interviews/[slug]': '/2025/interviews/[slug]',
    '/players': '/2025/players',
    '/meta': '/2025/meta',
    '/about': '/2025/about',
    '/tournament': '/2025/tournament',
    '/tickets': '/2025/tickets',
    '/staff': '/2025/staff',
  },
  integrations: [cmsPreviewCss()],
});
