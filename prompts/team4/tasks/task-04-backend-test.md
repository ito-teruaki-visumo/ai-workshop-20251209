# タスク 04: バックエンド - API のテスト

## 目的

作成した API エンドポイントが正しく動作することを確認する

## 実装場所

`TodoApi/TodoApi.http`

## 実装内容

### テストケースの作成

```http
### 1. クエスト一覧取得（空の状態）
GET http://localhost:5000/api/quests
Content-Type: application/json

###

### 2. クエスト新規作成
POST http://localhost:5000/api/quests
Content-Type: application/json

{
  "title": "データベース設計を完了する"
}

###

### 3. クエスト一覧取得（1件ある状態）
GET http://localhost:5000/api/quests
Content-Type: application/json

###

### 4. クエスト完了切り替え（idは作成されたクエストのIDに置き換え）
PATCH http://localhost:5000/api/quests/1/toggle
Content-Type: application/json

###

### 5. クエスト削除（idは作成されたクエストのIDに置き換え）
DELETE http://localhost:5000/api/quests/1
Content-Type: application/json

###
```

## テスト手順

1. **API サーバーを起動**

   ```bash
   cd TodoApi
   dotnet run
   ```

2. **TodoApi.http ファイルを開く**

   - VS Code で`TodoApi.http`を開く
   - REST Client エクステンションがインストールされていることを確認

3. **各エンドポイントをテスト**
   - 各リクエストの上にある「Send Request」をクリック
   - レスポンスが正しいことを確認

## チェックリスト

- [ ] API サーバーを起動
- [ ] GET /api/quests が空の配列を返すことを確認
- [ ] POST /api/quests でクエストが作成されることを確認
- [ ] GET /api/quests で作成したクエストが返されることを確認
- [ ] PATCH /api/quests/{id}/toggle で完了状態が切り替わることを確認
- [ ] DELETE /api/quests/{id} でクエストが削除されることを確認
- [ ] エラーがないことを確認

## 所要時間

約 10 分

## 次のタスク

→ タスク 05: フロントエンド - Axios のインストールと設定
