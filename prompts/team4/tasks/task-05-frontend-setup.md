# タスク 05: フロントエンド - Axios のインストールと設定

## 目的

API との通信を行うための Axios ライブラリをセットアップする

## 実装場所

- `TodoApp/` (npm パッケージのインストール)
- `TodoApp/src/services/api.ts` (新規作成)

## 実装内容

### 1. Axios のインストール

```bash
cd TodoApp
npm install axios
```

### 2. API サービスファイルの作成

`src/services/api.ts`:

```typescript
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Quest {
  id: number;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateQuestDto {
  title: string;
}

export const questApi = {
  // クエスト一覧取得
  getAll: async (): Promise<Quest[]> => {
    const response = await apiClient.get<Quest[]>("/quests");
    return response.data;
  },

  // クエスト作成
  create: async (dto: CreateQuestDto): Promise<Quest> => {
    const response = await apiClient.post<Quest>("/quests", dto);
    return response.data;
  },

  // クエスト完了切り替え
  toggle: async (id: number): Promise<Quest> => {
    const response = await apiClient.patch<Quest>(`/quests/${id}/toggle`);
    return response.data;
  },

  // クエスト削除
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/quests/${id}`);
  },
};
```

## チェックリスト

- [ ] `TodoApp`ディレクトリに移動
- [ ] `npm install axios`を実行
- [ ] `src/services`フォルダを作成
- [ ] `api.ts`ファイルを作成
- [ ] `Quest`インターフェースを定義
- [ ] `CreateQuestDto`インターフェースを定義
- [ ] `questApi`オブジェクトに 4 つのメソッドを実装
- [ ] API_BASE_URL が正しいことを確認

## 所要時間

約 10 分

## 次のタスク

→ タスク 06: QuestForm コンポーネントの作成
