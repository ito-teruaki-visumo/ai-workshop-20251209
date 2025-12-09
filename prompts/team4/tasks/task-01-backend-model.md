# タスク 01: バックエンド - Quest モデルの作成

## 目的

クエスト（タスク）を表すデータモデルを作成する

## 実装場所

`TodoApi/Models/Quest.cs`

## 実装内容

### Phase 1（ゴール 1 達成）の最小限モデル

```csharp
public class Quest
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### Phase 2 で追加予定のプロパティ（後回し）

```csharp
// Phase 2で追加
public string? Description { get; set; }
public string Rank { get; set; } = "D"; // F/E/D/C/B/A/S
public string GuildType { get; set; } = "Personal"; // Work/Personal/Study/Other
public int Reward { get; set; } // ランクに応じて自動計算
public DateTime? CompletedAt { get; set; }
```

## チェックリスト

- [ ] `Models`フォルダを作成
- [ ] `Quest.cs`ファイルを作成
- [ ] Phase 1 の最小限プロパティを実装
- [ ] プロパティに適切なデフォルト値を設定

## 所要時間

約 5 分

## 次のタスク

→ タスク 02: QuestController とメモリストレージの作成
