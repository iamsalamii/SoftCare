using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using SoftCare.Application.Common.Interfaces;
using SoftCare.Application.DTOs;
using SoftCare.Domain.Entities;
using SoftCare.Infrastructure.Identity;

namespace SoftCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthController(IApplicationDbContext context, IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    [HttpPost("login")]
    [EnableRateLimiting("LoginPolicy")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.IsActive);

        if (user == null)
        {
            return Unauthorized(new { message = "Identifiants invalides ou utilisateur introuvable." });
        }

        // Vérification par hachage BCrypt ou mot de passe démo par défaut
        bool isPasswordValid = false;
        try
        {
            isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        }
        catch
        {
            isPasswordValid = (request.Password == "demo123");
        }

        if (!isPasswordValid && request.Password != "demo123")
        {
            return Unauthorized(new { message = "Identifiants invalides ou utilisateur introuvable." });
        }

        var token = _jwtTokenGenerator.GenerateToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Department = user.DepartmentId,
            Phone = user.Phone,
            Avatar = user.Avatar,
            Specialization = user.Specialization,
            LicenseNumber = user.LicenseNumber,
            Status = user.Status,
            Active = user.IsActive,
            CreatedAt = user.CreatedAt
        };

        return Ok(new LoginResponse
        {
            Token = token,
            User = userDto
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] CreateUserRequest request)
    {
        var email = request.Email.Trim().ToLower();
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
        {
            return BadRequest(new { message = "Un compte avec cette adresse email existe déjà." });
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "nurse", // Fixed: Prevent Privilege Escalation by assigning default role

            DepartmentId = request.Department,
            Phone = request.Phone,
            Specialization = request.Specialization,
            LicenseNumber = request.LicenseNumber,
            Status = "active"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            Department = user.DepartmentId,
            Phone = user.Phone,
            Specialization = user.Specialization,
            LicenseNumber = user.LicenseNumber,
            Status = user.Status,
            Active = user.IsActive,
            CreatedAt = user.CreatedAt
        });
    }

    [HttpGet("users")]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _context.Users
            .Where(u => u.IsActive)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Department = u.DepartmentId,
                Phone = u.Phone,
                Avatar = u.Avatar,
                Specialization = u.Specialization,
                LicenseNumber = u.LicenseNumber,
                Status = u.Status,
                Active = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }
}
