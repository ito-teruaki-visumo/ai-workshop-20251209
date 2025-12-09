# TODO アプリケーション

ユーザー認証機能を備えた個人用タスク管理アプリケーションです。

## 技術スタック

- **バックエンド**: Node.js + Express.js
- **データベース**: MySQL 8.0
- **認証**: bcrypt + express-session

## ディレクトリ構造

```
src/
├── app.js                  # メインアプリケーション
├── config/
│   ├── constants.js        # 定数定義
│   └── database.js         # DB接続設定
├── controllers/
│   └── authController.js   # 認証ロジック
├── middleware/
│   ├── auth.js             # 認証ミドルウェア
│   └── errorHandler.js     # エラーハンドリング
├── models/
│   └── User.js             # ユーザーモデル
├── routes/
│   └── auth.js             # 認証ルート
├── scripts/
│   └── initDatabase.js     # DB初期化スクリプト
└── utils/
    ├── response.js         # レスポンスフォーマット
    └── validators.js       # バリデーション
```

## セットアップ

### 1. 環境変数の設定

`.env` ファイルを作成し、以下の環境変数を設定してください：

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=todo_app
DB_PORT=3306

# Session
SESSION_SECRET=your-secret-key-here
```

### 2. パッケージのインストール

```bash
npm install
```

### 3. アプリケーションの起動

```bash
npm start
```

開発環境では以下のコマンドも使用可能です：

```bash
npm run dev  # nodemonで自動リロード
```

## API エンドポイント

### 認証関連

| メソッド | エンドポイント       | 説明         | 認証 |
| -------- | -------------------- | ------------ | ---- |
| POST     | `/api/auth/register` | ユーザー登録 | 不要 |
| POST     | `/api/auth/login`    | ログイン     | 不要 |
| POST     | `/api/auth/logout`   | ログアウト   | 必要 |

### ユーザー登録

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**レスポンス (201):**

```json
{
  "id": 1,
  "username": "testuser",
  "message": "ユーザー登録が完了しました"
}
```

### ログイン

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "testuser", "password": "password123"}'
```

**レスポンス (200):**

```json
{
  "id": 1,
  "username": "testuser",
  "message": "ログインしました"
}
```

### ログアウト

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

**レスポンス (200):**

```json
{
  "message": "ログアウトしました"
}
```

## バリデーションルール

### ユーザー登録

- **ユーザー名**: 3 ～ 50 文字、英数字とアンダースコアのみ
- **パスワード**: 8 文字以上

## エラーレスポンス

### バリデーションエラー (400)

```json
{
  "error": "バリデーションエラー",
  "details": [
    "ユーザー名は3文字以上50文字以下である必要があります",
    "パスワードは8文字以上である必要があります"
  ]
}
```

### 認証エラー (401)

```json
{
  "error": "ユーザー名またはパスワードが間違っています"
}
```

### 重複エラー (409)

```json
{
  "error": "ユーザー名は既に使用されています"
}
```

## 開発ロードマップ

### Phase 1: MVP ✅

- [x] ユーザー認証（登録・ログイン・ログアウト）
- [ ] 基本的なタスク管理（CRUD）
- [ ] シンプルな UI

### Phase 2: 拡張機能（将来対応）

- [ ] タスク検索・フィルタリング強化
- [ ] UI/UX 改善
- [ ] パフォーマンス最適化

## ライセンス

ISC
