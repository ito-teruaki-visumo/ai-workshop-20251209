using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]s")]
public class QuestController : ControllerBase
{
    // メモリストレージ（Phase 1ではDB不要）
    private static List<Quest> _quests = new List<Quest>();
    private static int _nextId = 1;

    // GET /api/quests - 一覧取得
    [HttpGet]
    public ActionResult<IEnumerable<Quest>> GetQuests()
    {
        return Ok(_quests);
    }

    // POST /api/quests - 新規作成
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

    // PATCH /api/quests/{id}/toggle - 完了切り替え
    [HttpPatch("{id}/toggle")]
    public ActionResult<Quest> ToggleQuest(int id)
    {
        var quest = _quests.FirstOrDefault(q => q.Id == id);
        if (quest == null)
            return NotFound();
        
        quest.IsCompleted = !quest.IsCompleted;
        return Ok(quest);
    }

    // DELETE /api/quests/{id} - 削除
    [HttpDelete("{id}")]
    public IActionResult DeleteQuest(int id)
    {
        var quest = _quests.FirstOrDefault(q => q.Id == id);
        if (quest == null)
            return NotFound();
        
        _quests.Remove(quest);
        return NoContent();
    }
}
