using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// MySQL接続文字列（ハードコーディング）
const string connectionString = "Server=db;Port=3306;Database=devdb;User=devuser;Password=devpassword;";

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

app.Run();
