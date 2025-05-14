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
    [Authorize(Roles = "Customer")]
    [HttpPost("customer-policy")]
    public IActionResult CheckCustomerPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = accountService.CheckForCustomerPolicy(request);
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for customer." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [Authorize(Roles = "Vendor")]
    [HttpPost("vendor-policy")]
    public IActionResult CheckVendorPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = accountService.CheckForVendorPolicy(request);
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for vendor." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin-policy")]
    public IActionResult CheckAdminPolicy([FromBody] CheckForPolicyRequest request)
    {
        var result = accountService.CheckForAdminPolicy(request);
        return result switch
        {
            CheckForPolicyOutcomes.Success => Ok(),
            CheckForPolicyOutcomes.Failure => Unauthorized(new ProblemDetails { Detail = "Access denied for admin." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [Authorize(Roles = "Admin")]
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

    [Authorize(Roles = "Customer")]
    [HttpPut("customer/{email}")]
    public async Task<IActionResult> UpdateCustomer(string email, [FromBody] UpdateCustomerRequest request)
    {
        var result = await accountService.UpdateCustomerInfo(email, request, "Customer");
        return result switch
        {
            UpdateUserInfoOutcomes.Success => Ok(),
            UpdateUserInfoOutcomes.EmailNotFound => NotFound(new ProblemDetails { Detail = "User not found." }),
            UpdateUserInfoOutcomes.UserIsAdmin => NotFound(new ProblemDetails { Detail = "Admin users don't have profile info." }),
            UpdateUserInfoOutcomes.InvalidToken => Unauthorized(new ProblemDetails { Detail = "Invalid token." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }

    [Authorize(Roles = "Vendor")]
    [HttpPut("vendor/{email}")]
    public async Task<IActionResult> UpdateVendor(string email, [FromBody] UpdateVendorRequest request)
    {
        var result = await accountService.UpdateCustomerInfo(email, request, "Vendor");
        return result switch
        {
            UpdateUserInfoOutcomes.Success => Ok(),
            UpdateUserInfoOutcomes.EmailNotFound => NotFound(new ProblemDetails { Detail = "User not found." }),
            UpdateUserInfoOutcomes.UserIsAdmin => NotFound(new ProblemDetails { Detail = "Admin users don't have profile info." }),
            UpdateUserInfoOutcomes.WrongUserType => Forbid(),
            UpdateUserInfoOutcomes.InvalidToken => Unauthorized(new ProblemDetails { Detail = "Invalid token." }),
            _ => StatusCode(500, new ProblemDetails { Detail = "Unexpected error." })
        };
    }
}