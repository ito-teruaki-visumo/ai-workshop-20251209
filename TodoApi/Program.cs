using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// コントローラーのサポートを追加
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS設定を追加
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVue",
        policy => policy
            .WithOrigins("http://localhost:5173") // Viteのデフォルトポート
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORSミドルウェアを使用
app.UseCors("AllowVue");

// コントローラーのルーティングを有効化
app.MapControllers();

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
