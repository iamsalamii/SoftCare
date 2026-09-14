using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SoftCare.Application.DTOs;

public class LoginRequest
{
    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "Le format de l'email est invalide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
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
    [Required(ErrorMessage = "Le nom est requis")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Le nom doit contenir entre 2 et 100 caractères")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "Le format de l'email est invalide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Le mot de passe doit faire au moins 6 caractères")]
    public string Password { get; set; } = "demo123";
    
    [Required]
    public string Role { get; set; } = "doctor";
    
    public string? Department { get; set; }
    
    [Phone(ErrorMessage = "Format de téléphone invalide")]
    public string? Phone { get; set; }
    
    public string? Specialization { get; set; }
    
    public string? LicenseNumber { get; set; }
}
