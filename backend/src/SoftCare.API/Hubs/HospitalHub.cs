using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SoftCare.API.Hubs;

public interface IHospitalClient
{
    Task ReceiveEmergencyAlert(object alert);
    Task ReceiveStockAlert(object alert);
    Task ReceiveBiobankAlert(object alert);
    Task ReceivePGxAlert(object alert);
    Task ReceiveAdmissionUpdate(object admission);
}

public class HospitalHub : Hub<IHospitalClient>
{
    public async Task SendEmergencyAlert(string patientName, string triageLevel, string chiefComplaint)
    {
        await Clients.All.ReceiveEmergencyAlert(new
        {
            patientName,
            triageLevel,
            chiefComplaint,
            timestamp = DateTime.UtcNow
        });
    }

    public async Task SendStockAlert(string medicationName, int currentStock, int minStock)
    {
        await Clients.All.ReceiveStockAlert(new
        {
            medicationName,
            currentStock,
            minStock,
            timestamp = DateTime.UtcNow
        });
    }

    public async Task SendBiobankAlert(string freezerName, string currentTemp, string message)
    {
        await Clients.All.ReceiveBiobankAlert(new
        {
            freezerName,
            currentTemp,
            message,
            timestamp = DateTime.UtcNow
        });
    }

    public async Task SendPGxAlert(string patientName, string medicationName, string riskLevel, string recommendation)
    {
        await Clients.All.ReceivePGxAlert(new
        {
            patientName,
            medicationName,
            riskLevel,
            recommendation,
            timestamp = DateTime.UtcNow
        });
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"--> [SignalR] Client connecté au Hub Hospitalier: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"--> [SignalR] Client déconnecté: {Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }
}
