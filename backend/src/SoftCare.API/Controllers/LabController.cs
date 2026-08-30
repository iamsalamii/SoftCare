using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Domain.Entities;

namespace SoftCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LabController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public LabController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("tests")]
    public async Task<ActionResult> GetLabTests()
    {
        var tests = await _context.LabTests.Where(t => t.IsActive).ToListAsync();
        return Ok(tests);
    }

    [HttpGet("orders")]
    public async Task<ActionResult> GetLabOrders()
    {
        var orders = await _context.LabOrders.Where(o => o.IsActive).OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(orders);
    }

    [HttpPost("orders")]
    public async Task<ActionResult> CreateLabOrder([FromBody] LabOrder order)
    {
        order.Id = Guid.NewGuid().ToString();
        _context.LabOrders.Add(order);
        await _context.SaveChangesAsync();
        return Ok(order);
    }
}
