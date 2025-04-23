# 私の推しちゃん診断（仮）

このリポジトリは、「私の推しちゃん診断（仮）」のウェブアプリケーションです。Cloudflare Workersを使用して実装されています。

## 機能

- シンプルで使いやすいフォームインターフェース
- Google Spreadsheetとの連携
- レスポンシブデザイン

## 前提条件

- Node.js
- npm
- Cloudflare アカウント

## インストール

```bash
# リポジトリのクローン
git clone https://github.com/otaotakahiro/cloudflare-workers-oshichan.git
cd cloudflare-workers-oshichan

# 依存パッケージのインストール
npm install
```

## 開発

ローカル開発サーバーを起動するには:

```bash
npm run dev
```

これにより、Wrangler を使用してローカル開発サーバーが起動します。

## デプロイ

Cloudflare Workers にデプロイするには:

```bash
# Cloudflareにログイン（初回のみ）
npm run login

# デプロイ実行
npm run deploy
```

## 開発ファイル構成

### バックエンド開発

バックエンド開発者は主に以下のファイルを操作します：

- `src/index.js` - メインのアプリケーションロジック、API エンドポイントの実装

API ルートの追加や修正は `src/index.js` 内で行います。大規模なアプリケーションの場合は、機能ごとにファイルを分割し、`src` ディレクトリ内に適切な構造を作ることをお勧めします。

### フロントエンド開発

フロントエンド開発者は主に `public` 以下のディレクトリ/ファイルを操作します。
フロントエンドは、静的ファイルとして配信されるため、ビルドプロセスは必要ありません。`public` ディレクトリ内のファイルは、Cloudflare Workers によって直接配信されます。

## ライセンス

[MIT](LICENSE)
