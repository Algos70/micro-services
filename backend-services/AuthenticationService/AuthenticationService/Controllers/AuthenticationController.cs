using System.IdentityModel.Tokens.Jwt;
using AuthenticationService.DTOs.Requests;
using AuthenticationService.Enums;
using AuthenticationService.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthenticationController(IAccountService accountService) : ControllerBase
{

    [HttpGet("/register")]
    public async Task<IActionResult> Register()
    {
        var idToken = Request.Headers["idtoken"].FirstOrDefault();

        if (string.IsNullOrWhiteSpace(idToken))
        {
            return Unauthorized("Missing ID token");
        }

        // Decode and optionally validate the token
        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(idToken);

        // Read claims
        var email = jwt.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
        var name = jwt.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
        var role = jwt.Claims.FirstOrDefault(c => c.Type == "roless")?.Value;


        UserType userType;
        userType = role switch
        {
            "Customer" => UserType.Customer,
            "Vendor" => UserType.Vendor,
            _ => throw new ArgumentException("Invalid role")
        };

        //create a new RegisterRequest object
        var registerRequest = new RegisterRequest
        {
            Email = email,
            Name = name,
            UserType = userType,
        };

        var status = await accountService.RegisterAsync(registerRequest );
        return status switch
        {
            RegistrationOutcomes.EmailAlreadyExists => StatusCode(StatusCodes.Status409Conflict,
                new ProblemDetails { Detail = "Email already exists." }),
            RegistrationOutcomes.SystemError => StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails { Detail = "User generation failed possibly due to invalid password." }),
            RegistrationOutcomes.EmailCantBeSend => StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Detail = "Email cant be sent possibly due to invalid email." }),
            RegistrationOutcomes.Success => Ok(),
            _ => StatusCode(StatusCodes.Status500InternalServerError,
                new ProblemDetails { Detail = "Unexpected error." })
        };
    }



    [HttpPost("customer-policy")]
    public async Task<IActionResult> CheckCustomerPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = await accountService.CheckForCustomerPolicy(request); // Ensure the method is asynchronous
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for customer." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [HttpPost("vendor-policy")]
    public async Task<IActionResult> CheckVendorPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = await accountService.CheckForVendorPolicy(request); // Ensure the method is asynchronous
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for vendor." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [HttpPost("admin-policy")]
    public async Task<IActionResult> CheckAdminPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = await accountService.CheckForAdminPolicy(request); // Ensure the method is asynchronous
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for admin." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [HttpGet("user/{email}")]
    public async Task<IActionResult> GetUserInfo(string email)
    {
        var (status, data) = await accountService.GetUserInfo(email);
        return status switch
        {
            GetUserInfoOutcomes.Success => Ok(data),
            GetUserInfoOutcomes.EmailNotFound => NotFound(new ProblemDetails { Detail = "User not found." }),
            GetUserInfoOutcomes.UserIsAdmin => NotFound(new ProblemDetails { Detail = "Admin users don't have profile info." }),
            GetUserInfoOutcomes.CustomerNotInitialized or GetUserInfoOutcomes.VendorNotInitialized =>
                NotFound(new ProblemDetails { Detail = "User not initialized properly." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }



    //[Authorize(Roles = "Customer")]
    //[HttpPut("customer/{email}")]
    //public async Task<IActionResult> UpdateCustomer(string email, [FromBody] UpdateCustomerRequest request)
    //{
    //    var result = await accountService.UpdateCustomerInfo(email, request, "Customer");
    //    return result switch
    //    {
    //        UpdateUserInfoOutcomes.Success => Ok(),
    //        UpdateUserInfoOutcomes.EmailNotFound => NotFound(new ProblemDetails { Detail = "User not found." }),
    //        UpdateUserInfoOutcomes.UserIsAdmin => NotFound(new ProblemDetails { Detail = "Admin users don't have profile info." }),
    //        UpdateUserInfoOutcomes.InvalidToken => Unauthorized(new ProblemDetails { Detail = "Invalid token." }),
    //        _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
    //    };
    //}

    //[Authorize(Roles = "Vendor")]
    //[HttpPut("vendor/{email}")]
    //public async Task<IActionResult> UpdateVendor(string email, [FromBody] UpdateVendorRequest request)
    //{
    //    var result = await accountService.UpdateCustomerInfo(email, request, "Vendor");
    //    return result switch
    //    {
    //        UpdateUserInfoOutcomes.Success => Ok(),
    //        UpdateUserInfoOutcomes.EmailNotFound => NotFound(new ProblemDetails { Detail = "User not found." }),
    //        UpdateUserInfoOutcomes.UserIsAdmin => NotFound(new ProblemDetails { Detail = "Admin users don't have profile info." }),
    //        UpdateUserInfoOutcomes.WrongUserType => Forbid(),
    //        UpdateUserInfoOutcomes.InvalidToken => Unauthorized(new ProblemDetails { Detail = "Invalid token." }),
    //        _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
    //    };
    //}
}