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
│   ├── authController.js   # 認証ロジック
│   └── tasksController.js  # タスク管理ロジック
├── middleware/
│   ├── auth.js             # 認証ミドルウェア
│   └── errorHandler.js     # エラーハンドリング
├── models/
│   ├── User.js             # ユーザーモデル
│   └── Task.js             # タスクモデル
├── routes/
│   ├── auth.js             # 認証ルート
│   └── tasks.js            # タスクルート
├── scripts/
│   └── initDatabase.js     # DB初期化スクリプト
└── utils/
    ├── response.js         # レスポンスフォーマット
    └── validators.js       # バリデーション

public/
├── css/
│   └── style.css           # 共通スタイル
├── js/
│   ├── login.js            # ログイン画面JS
│   ├── register.js         # 登録画面JS
│   └── dashboard.js        # ダッシュボードJS
├── login.html              # ログイン画面
├── register.html           # 登録画面
└── dashboard.html          # ダッシュボード
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

### タスク管理関連

| メソッド | エンドポイント   | 説明           | 認証 |
| -------- | ---------------- | -------------- | ---- |
| GET      | `/api/tasks`     | タスク一覧取得 | 必要 |
| POST     | `/api/tasks`     | タスク新規登録 | 必要 |
| PATCH    | `/api/tasks/:id` | タスク更新     | 必要 |
| DELETE   | `/api/tasks/:id` | タスク削除     | 必要 |

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

### タスク一覧取得

```bash
curl -X GET http://localhost:3000/api/tasks \
  -b cookies.txt
```

**クエリパラメータ:**

- `status`: `all` | `completed` | `pending`
- `search`: タスク名の部分検索
- `sort`: `created` | `updated`

**レスポンス (200):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "買い物に行く",
      "is_completed": false,
      "created_at": "2025-12-09T10:00:00Z",
      "updated_at": "2025-12-09T10:00:00Z"
    }
  ],
  "total": 1,
  "completed_count": 0
}
```

### タスク新規登録

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title": "買い物に行く"}'
```

**レスポンス (201):**

```json
{
  "id": 1,
  "title": "買い物に行く",
  "is_completed": false,
  "created_at": "2025-12-09T10:00:00Z",
  "updated_at": "2025-12-09T10:00:00Z",
  "message": "タスクが登録されました"
}
```

### タスク更新

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"is_completed": true}'
```

**レスポンス (200):**

```json
{
  "id": 1,
  "title": "買い物に行く",
  "is_completed": true,
  "created_at": "2025-12-09T10:00:00Z",
  "updated_at": "2025-12-09T12:00:00Z",
  "message": "タスクが更新されました"
}
```

### タスク削除

```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -b cookies.txt
```

**レスポンス (204):** 本文なし

## バリデーションルール

### ユーザー登録

- **ユーザー名**: 3 ～ 50 文字、英数字とアンダースコアのみ
- **パスワード**: 8 文字以上

### タスク

- **タスク名**: 1 ～ 255 文字

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
- [x] 基本的なタスク管理（CRUD）
- [x] シンプルな UI

### Phase 2: 拡張機能（将来対応）

- [ ] タスク検索・フィルタリング強化
- [ ] UI/UX 改善
- [ ] パフォーマンス最適化

## 画面一覧

| パス         | 画面名           | 説明                               |
| ------------ | ---------------- | ---------------------------------- |
| `/login`     | ログイン画面     | ユーザー認証                       |
| `/register`  | ユーザー登録画面 | 新規アカウント作成                 |
| `/dashboard` | ダッシュボード   | タスク一覧・追加・編集・削除・検索 |

## ライセンス

ISC
