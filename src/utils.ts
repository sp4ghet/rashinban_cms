// ニュース一覧・記事ページ共通の日付表記 (例: 2025.11.21)
export const formatDate = (d: Date) =>
  `${d.getUTCFullYear()}.${d.getUTCMonth() + 1}.${d.getUTCDate()}`;
