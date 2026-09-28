using System;
using Npgsql;

class Program {
    static void Main() {
        var connStr = "Host=localhost;Port=5432;Database=softcare_db;Username=postgres;Password=Salamsafe52@$";
        using var conn = new NpgsqlConnection(connStr);
        conn.Open();

        var tablesToCount = new[] { "Patients", "Admissions", "MedicalRecords", "Medications", "PharmacySales", "Users" };
        Console.WriteLine("--- RECORD COUNTS ---");
        foreach(var t in tablesToCount) {
            try {
                using var cmd = new NpgsqlCommand($"SELECT COUNT(*) FROM \"{t}\"", conn);
                var count = cmd.ExecuteScalar();
                Console.WriteLine($"{t}: {count}");
            } catch (Exception ex) {
                Console.WriteLine($"{t}: ERROR - {ex.Message}");
            }
        }
    }
}
