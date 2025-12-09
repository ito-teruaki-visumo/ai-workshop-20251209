# タスク 02: バックエンド - QuestController の作成

## 目的

クエストの CRUD 操作を行う API エンドポイントを実装する

## 実装場所

`TodoApi/Controllers/QuestController.cs`

## 実装内容

### メモリストレージ（Phase 1 では DB 不要）

```csharp
// クラスのフィールドとして定義
private static List<Quest> _quests = new List<Quest>();
private static int _nextId = 1;
```

### エンドポイント

#### 1. GET /api/quests - 一覧取得

```csharp
[HttpGet]
public ActionResult<IEnumerable<Quest>> GetQuests()
{
    return Ok(_quests);
}
```

#### 2. POST /api/quests - 新規作成

```csharp
[HttpPost]
public ActionResult<Quest> CreateQuest([FromBody] CreateQuestDto dto)
{
    var quest = new Quest
    {
        Id = _nextId++,
        Title = dto.Title,
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow
    };

    _quests.Add(quest);
    return CreatedAtAction(nameof(GetQuests), new { id = quest.Id }, quest);
}
```

#### 3. PATCH /api/quests/{id}/toggle - 完了切り替え

```csharp
[HttpPatch("{id}/toggle")]
public ActionResult<Quest> ToggleQuest(int id)
{
    var quest = _quests.FirstOrDefault(q => q.Id == id);
    if (quest == null)
        return NotFound();

    quest.IsCompleted = !quest.IsCompleted;
    return Ok(quest);
}
```

#### 4. DELETE /api/quests/{id} - 削除

```csharp
[HttpDelete("{id}")]
public IActionResult DeleteQuest(int id)
{
    var quest = _quests.FirstOrDefault(q => q.Id == id);
    if (quest == null)
        return NotFound();

    _quests.Remove(quest);
    return NoContent();
}
```

### DTO クラス

```csharp
public class CreateQuestDto
{
    public string Title { get; set; } = string.Empty;
}
```

## チェックリスト

- [ ] `Controllers`フォルダに`QuestController.cs`を作成
- [ ] `[ApiController]`と`[Route("api/[controller]s")]`属性を追加
- [ ] メモリストレージ（static フィールド）を定義
- [ ] GET /api/quests エンドポイントを実装
- [ ] POST /api/quests エンドポイントを実装
- [ ] PATCH /api/quests/{id}/toggle エンドポイントを実装
- [ ] DELETE /api/quests/{id} エンドポイントを実装
- [ ] `CreateQuestDto`クラスを作成

## 所要時間

約 20 分

## 次のタスク

→ タスク 03: CORS 設定の追加
