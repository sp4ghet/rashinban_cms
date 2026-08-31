# /patron (SUPPORT A PLAYER PROGRAM) ページ

日付: 2026-08-31
デザイン: `docs/design/RASHINBAN2026/SUPPORT A PLAYER PROGRAM@2x.png`

## 目的

選手への支援プログラム (選手による申請 / 選手指名型 / 個人協賛型) の説明ページを
`/patron` に追加し、申請済みの選手一覧とご支援者一覧を Sveltia CMS から管理できるようにする。

## ページ構成

既存の固定ページ (`pages` コレクション) に `patron` を追加し、`src/pages/[slug].astro` で描画する。
セクションブロックに3種類を追加:

| type | 用途 | 内容 |
| --- | --- | --- |
| `program` | HOW THE PROGRAM WORKS | 申し込み種別 (①②③) のリスト。各項目は 小見出し / リード文 / 申請フォームの白帯リンク / 本文 (markdown) / 支援フロー (アイコン + タイトル + 補足) |
| `applications` | PLAYER APPLICATIONS | 前書き + `players` コレクションのカード一覧 (レート降順) |
| `supporters` | SUPPORTERS | 前書き + `supporters` コレクションを「個人協賛」「選手指名支援」に分けて表示 |

NOTE / SCHEDULE は既存の `text` ブロックで、本文 markdown の `###` と `---` で小見出し・区切り線を表現する
(`.guide-body` に h3 / hr のスタイルを追加)。

markdown の注意: `**ラベル：**本文` は CommonMark の規則で太字にならない (全角コロンが約物扱い) ため、
`**ラベル**：本文` と書く。

## コンテンツコレクション

- `players` (`src/content/players/*.yaml`): `name`, `geoguessrUrl`, `rating` (整数), `comment`, `supported` (真偽), `supporter` (任意)
- `supporters` (`src/content/supporters/*.yaml`): `name`, `player` (任意・指名した選手名。Sveltia の relation ウィジェットで `players` から選ぶ)

`player` が空のご支援者は「個人協賛」、入っているものは「選手指名支援」に `NAME(player)` 形式で表示する。
`supported` をオンにした選手のカードはグレーアウトし、中央に「支援成立 (`supporter`)」を重ねる。

## 未確定事項

- 各申請フォームのURL (`formUrl`) は未定のため空。空の間は白帯がリンクにならない
- 支援フローの「マッチング」アイコンは Bootstrap Icons に握手アイコンが無いため `people-fill` で代用
