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
  site: 'https://cms.rashinban.org',
  trailingSlash: 'ignore',
  integrations: [cmsPreviewCss()],
});
