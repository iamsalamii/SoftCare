import re
with open('scratch/db_init/Program.cs', 'r', encoding='utf-8') as f:
    content = f.read()

injection = """
        // 4.5 Insert Medical Records
        var countRecords = (long)await command.ExecuteScalarAsync("SELECT COUNT(*) FROM \\"MedicalRecords\\"")!;
        if (countRecords == 0)
        {
            var pId = (string)await command.ExecuteScalarAsync("SELECT \\"Id\\" FROM \\"Patients\\" LIMIT 1")!;
            var uId = (string)await command.ExecuteScalarAsync("SELECT \\"Id\\" FROM \\"Users\\" WHERE \\"Role\\" = 'doctor' LIMIT 1")!;
            
            command.CommandText = "INSERT INTO \\"MedicalRecords\\" (\\"Id\\", \\"PatientId\\", \\"DoctorId\\", \\"Date\\", \\"Type\\", \\"Title\\", \\"Description\\", \\"SymptomsJson\\", \\"Diagnosis\\", \\"Treatment\\", \\"Status\\", \\"IsActive\\", \\"CreatedAt\\", \\"UpdatedAt\\") VALUES (@rid, @pId, @uId, @date, 'consultation', 'Consultation Initiale', 'Patient se plaint de douleurs thoraciques.', '[\\"Douleur thoracique\\", \\"Essoufflement\\"]', 'Angine de poitrine suspectée', 'Repos et surveillance', 'active', true, @date, @date)";
            command.Parameters.Clear();
            command.Parameters.AddWithValue("rid", Guid.NewGuid().ToString());
            command.Parameters.AddWithValue("pId", pId);
            command.Parameters.AddWithValue("uId", uId);
            command.Parameters.AddWithValue("date", DateTime.UtcNow);
            await command.ExecuteNonQueryAsync();
            Console.WriteLine("-> MedicalRecords inserted");
        }
"""

content = content.replace('// 5. Check if medications exist', injection + '\n        // 5. Check if medications exist')
with open('scratch/db_init/Program.cs', 'w', encoding='utf-8') as f:
    f.write(content)
