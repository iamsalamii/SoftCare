using System;
using Npgsql;
using System.IO;

class Program {
    static void Main() {
        var connStr = "Host=localhost;Port=5432;Database=softcare_db;Username=postgres;Password=Salamsafe52@$";
        using var conn = new NpgsqlConnection(connStr);
        conn.Open();
        var sql = File.ReadAllText(@"c:\Users\DELL\ALL_PROJECTS\Future-Projects\project-softcare\backend\pharmacy-sales-migration.sql");
        using var cmd = new NpgsqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        Console.WriteLine("Tables created successfully!");
    }
}
