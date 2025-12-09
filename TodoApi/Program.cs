using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Use CORS
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// MySQL接続文字列（ハードコーディング）
const string connectionString = "Server=db;Port=3306;Database=devdb;User=devuser;Password=devpassword;";

// Initialize Database
async Task InitDatabase()
{
    try
    {
        // Create Database if not exists
        var builder = new MySqlConnectionStringBuilder(connectionString);
        builder.Database = ""; // Remove database to connect to server only
        
        await using (var serverConnection = new MySqlConnection(builder.ConnectionString))
        {
            await serverConnection.OpenAsync();
            await using var dbCommand = new MySqlCommand("CREATE DATABASE IF NOT EXISTS devdb;", serverConnection);
            await dbCommand.ExecuteNonQueryAsync();
        }

        // Create Table
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        var sql = @"
            CREATE TABLE IF NOT EXISTS Todos (
                Id INT AUTO_INCREMENT PRIMARY KEY,
                Title VARCHAR(255) NOT NULL,
                IsCompleted BOOLEAN NOT NULL DEFAULT FALSE,
                IsDeleted BOOLEAN NOT NULL DEFAULT FALSE
            );";

        await using var tableCommand = new MySqlCommand(sql, connection);
        await tableCommand.ExecuteNonQueryAsync();
        
        // Add IsDeleted column if it doesn't exist (migration for existing table)
        try 
        {
            // Check if column exists
            var checkColumnSql = @"
                SELECT COUNT(*) 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = 'devdb' 
                AND TABLE_NAME = 'Todos' 
                AND COLUMN_NAME = 'IsDeleted';";
            
            await using var checkCommand = new MySqlCommand(checkColumnSql, connection);
            var count = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());

            if (count == 0)
            {
                var migrationSql = "ALTER TABLE Todos ADD COLUMN IsDeleted BOOLEAN NOT NULL DEFAULT FALSE;";
                await using var migrationCommand = new MySqlCommand(migrationSql, connection);
                await migrationCommand.ExecuteNonQueryAsync();
                Console.WriteLine("Added IsDeleted column.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Migration failed: {ex.Message}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database initialization failed: {ex.Message}");
    }
}

// Run initialization
await InitDatabase();

// MySQL接続テスト用エンドポイント
app.MapGet("/db-test", async () =>
{
    try
    {
        await using var connection = new MySqlConnection(connectionString);
        await connection.OpenAsync();

        await using var command = new MySqlCommand("SELECT VERSION()", connection);
        var version = await command.ExecuteScalarAsync();

        return Results.Ok(new { status = "connected", mysqlVersion = version?.ToString() });
    }
    catch (Exception ex)
    {
        return Results.Problem($"MySQL connection failed: {ex.Message}");
    }
})
.WithName("DbTest")
.WithOpenApi();

// Todo Endpoints

app.MapGet("/todos", async () =>
{
    var todos = new List<Todo>();
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();
    
    await using var command = new MySqlCommand("SELECT Id, Title, IsCompleted, IsDeleted FROM Todos WHERE IsDeleted = FALSE", connection);
    await using var reader = await command.ExecuteReaderAsync();
    while (await reader.ReadAsync())
    {
        todos.Add(new Todo
        {
            Id = reader.GetInt32(0),
            Title = reader.GetString(1),
            IsCompleted = reader.GetBoolean(2),
            IsDeleted = reader.GetBoolean(3)
        });
    }
    return Results.Ok(todos);
});

app.MapPost("/todos", async (TodoDto todoDto) =>
{
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();

    var sql = "INSERT INTO Todos (Title, IsCompleted, IsDeleted) VALUES (@Title, @IsCompleted, FALSE); SELECT LAST_INSERT_ID();";
    await using var command = new MySqlCommand(sql, connection);
    command.Parameters.AddWithValue("@Title", todoDto.Title);
    command.Parameters.AddWithValue("@IsCompleted", false);

    var id = Convert.ToInt32(await command.ExecuteScalarAsync());
    
    return Results.Created($"/todos/{id}", new Todo { Id = id, Title = todoDto.Title, IsCompleted = false, IsDeleted = false });
});

app.MapPut("/todos/{id}", async (int id, TodoDto todoDto) =>
{
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();

    var sql = "UPDATE Todos SET Title = @Title, IsCompleted = @IsCompleted WHERE Id = @Id";
    await using var command = new MySqlCommand(sql, connection);
    command.Parameters.AddWithValue("@Title", todoDto.Title);
    command.Parameters.AddWithValue("@IsCompleted", todoDto.IsCompleted);
    command.Parameters.AddWithValue("@Id", id);

    var rowsAffected = await command.ExecuteNonQueryAsync();
    return rowsAffected > 0 ? Results.NoContent() : Results.NotFound();
});

app.MapDelete("/todos/{id}", async (int id) =>
{
    await using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();

    // Soft delete
    var sql = "UPDATE Todos SET IsDeleted = TRUE WHERE Id = @Id";
    await using var command = new MySqlCommand(sql, connection);
    command.Parameters.AddWithValue("@Id", id);

    var rowsAffected = await command.ExecuteNonQueryAsync();
    return rowsAffected > 0 ? Results.NoContent() : Results.NotFound();
});

app.Run();

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public bool IsDeleted { get; set; }
}

public class TodoDto
{
    public string Title { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}
