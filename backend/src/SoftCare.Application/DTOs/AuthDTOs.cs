using System;
using System.Collections.Generic;

namespace SoftCare.Application.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }
    public string Status { get; set; } = "active";
    public bool Active { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}

public class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = "demo123";
    public string Role { get; set; } = "doctor";
    public string? Department { get; set; }
    public string? Phone { get; set; }
    public string? Specialization { get; set; }
    public string? LicenseNumber { get; set; }
}
