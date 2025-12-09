# タスク 03: バックエンド - CORS 設定

## 目的

フロントエンド（Vue.js）から API にアクセスできるように CORS 設定を追加する

## 実装場所

`TodoApi/Program.cs`

## 実装内容

### CORS 設定の追加

`builder.Services.AddControllers();` の後に追加：

```csharp
// CORS設定を追加
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVue",
        policy => policy
            .WithOrigins("http://localhost:5173") // Viteのデフォルトポート
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

### ミドルウェアの使用

`app.UseAuthorization();` の前に追加：

```csharp
app.UseCors("AllowVue");
```

## チェックリスト

- [ ] `Program.cs`を開く
- [ ] CORS 設定を`builder.Services`に追加
- [ ] `app.UseCors("AllowVue")`をミドルウェアパイプラインに追加
- [ ] ポート番号が正しいことを確認（Vite は通常 5173）

## 所要時間

約 5 分

## 次のタスク

→ タスク 04: API のテスト（TodoApi.http）
