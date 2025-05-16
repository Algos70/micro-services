using System.ComponentModel.DataAnnotations;
using AuthenticationService.Enums;

namespace AuthenticationService.DTOs.Requests;

public class RegisterRequest
{
    [Required] [EmailAddress] public string Email { get; set; }

    //name

    [Required][MaxLength(50)] public string Name { get; set; }

    [Required]
    [EnumDataType(typeof(UserType))]
    public UserType UserType { get; set; }
}