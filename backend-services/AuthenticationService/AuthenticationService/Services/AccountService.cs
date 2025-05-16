using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using AuthenticationService.Contexts;
using AuthenticationService.DTOs;
using AuthenticationService.DTOs.Requests;
using AuthenticationService.DTOs.Responses;
using AuthenticationService.Entities;
using AuthenticationService.Enums;
using AuthenticationService.Interfaces;
using AuthenticationService.Interfaces.Repositories;
using AuthenticationService.Interfaces.Services;
using AuthenticationService.Settings;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Extensions;
using System.Net;
using System.Text.Json;


namespace AuthenticationService.Services;

public class AccountService(
    IOptions<Auth0Settings> auth0Options,
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ITokenService tokenService,
    UserDbContext dbContext,
    IEmailService emailService,
    IOptions<AppRootSettings> appRootOptions,
    ICustomerRepository customerRepository,
    IVendorRepository vendorRepository,
    IMapper mapper,
    ILogger<AccountService> logger,
    IHttpClientFactory httpClientFactory)
    : IAccountService
{
    
    private readonly AppRootSettings _appRootSettings = appRootOptions.Value;
    private readonly Auth0Settings _auth0Settings = auth0Options.Value;
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    public async Task<RegistrationOutcomes> RegisterAsync(RegisterRequest request)
    {
        var userWithSameEmail = await userManager.FindByEmailAsync(request.Email);
        if (userWithSameEmail != null)
        {
            return RegistrationOutcomes.EmailAlreadyExists;
        }

        var user = new User()
        {
            Email = request.Email,
            UserName = NormalizeToAscii( request.Name.Replace(" ", "")),
        };

        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            return RegistrationOutcomes.SystemError;
        }

        var userType = request.UserType;

        var role = userType == UserType.Customer ? Roles.Customer : Roles.Vendor;
        await userManager.AddToRoleAsync(user, role.ToString());

        if (userType == UserType.Customer)
        {
            var customer = new Customer()
            {
                UserId = user.Id,
                FullName = user.UserName,
                Address = "",
                PhoneNumber = ""
            };
            await dbContext.Customers.AddAsync(customer);
        }
        else
        {
            var vendor = new Vendor()
            {
                UserId = user.Id,
                BusinessName = "",
                Address = "",
                PhoneNumber = ""
            };
            await dbContext.Vendors.AddAsync(vendor);
        }

        await dbContext.SaveChangesAsync();

        return RegistrationOutcomes.Success;
    }
    public static string NormalizeToAscii(string input)
    {
        return input
            .Replace("ç", "c").Replace("Ç", "C")
            .Replace("ğ", "g").Replace("Ğ", "G")
            .Replace("ı", "i").Replace("İ", "I")
            .Replace("ö", "o").Replace("Ö", "O")
            .Replace("ş", "s").Replace("Ş", "S")
            .Replace("ü", "u").Replace("Ü", "U");
    }

    public async Task<(AuthenticationOutcomes, AuthenticationResponse?)> AuthenticateAsync(
        AuthenticationRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return (AuthenticationOutcomes.EmailNotFound, null);
        }

        var result = await signInManager.PasswordSignInAsync(user, request.Password, false, false);
        if (!result.Succeeded)
        {
            return (AuthenticationOutcomes.WrongPassword, null);
        }

        var jwSecurityToken = await tokenService.GenerateJwToken(user);
        var refreshToken = tokenService.GenerateRefreshToken();
        user.RefreshTokens.Add(refreshToken);
        await userManager.UpdateAsync(user);
        await dbContext.SaveChangesAsync();
        var response = new AuthenticationResponse()
        {
            RefreshToken = refreshToken.Token,
            JwToken = jwSecurityToken,
        };
        return (AuthenticationOutcomes.Success, response);
    }

    public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
    {
        var confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var tokenBytes = Encoding.UTF8.GetBytes(confirmationToken);
        var encodedToken = WebEncoders.Base64UrlEncode(tokenBytes);

        return encodedToken;
    }

    public async Task<ConfirmEmailOutcomes> ConfirmEmailAsync(ConfirmEmailRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return ConfirmEmailOutcomes.EmailNotFound;
        }

        var tokenBytes = WebEncoders.Base64UrlDecode(request.Token);
        var decodedToken = Encoding.UTF8.GetString(tokenBytes);

        var result = await userManager.ConfirmEmailAsync(user, decodedToken);
        return result.Succeeded ? ConfirmEmailOutcomes.Success : ConfirmEmailOutcomes.InvalidToken;
    }

    public async Task<RequestPasswordResetOutcomes> RequestPasswordReset(PasswordResetRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return RequestPasswordResetOutcomes.EmailNotFound;
        }

        var resetCode = await userManager.GeneratePasswordResetTokenAsync(user);
        var encodedResetCode = Uri.EscapeDataString(resetCode);
        Debug.Assert(user.Email != null, "user.Email != null");
        var email = new Email()
        {
            Subject = "RESET YOUR PASSWORD",
            Body = $@"<p>This is your password reset code [{encodedResetCode}]</p>
                       <p>If you didn't request this, please ignore this email.</p>",
            To = user.Email
        };

        try
        {
            await emailService.SendEmailAsync(email);
        }
        catch (Exception ex)
        {
            return RequestPasswordResetOutcomes.EmailCantBeSend;
        }

        return RequestPasswordResetOutcomes.Success;
    }

    public async Task<ConfirmPasswordResetOutcomes> ConfirmPasswordReset(ConfirmPasswordResetRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return ConfirmPasswordResetOutcomes.EmailNotFound;
        }

        var decodedResetCode = Uri.UnescapeDataString(request.Token);

        var resetPasswordResult = await userManager.ResetPasswordAsync(user, decodedResetCode, request.Password);
        return resetPasswordResult.Succeeded
            ? ConfirmPasswordResetOutcomes.Success
            : ConfirmPasswordResetOutcomes.UnsupportedPasswordFormat;
    }

    public IList<string> GetUserRoles(string jwToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwToken);
        var roles = token.Claims.Where(c => c.Type == "roless").Select(c => c.Value).ToList();

        return roles;
    }
    
    public string? GetUserEmailFromToken(string jwToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(jwToken);
        var emailClaim = token.Claims.FirstOrDefault(c => c.Type == "email");

        return emailClaim?.Value;
    }

    public async Task<CheckForPolicyOutcomes> CheckForPolicy(CheckForPolicyRequest request, Roles requiredRole)
    {
        
        var roles = GetUserRoles(request.Token);
        bool isRoleValid = false;

        foreach (var role in roles)
        {
            if (role == requiredRole.ToString())
            {
                isRoleValid = true;
                break;
            }
        }
        if (!isRoleValid)
        {
            return CheckForPolicyOutcomes.Failure;
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", request.Token);

        var response = await client.GetAsync($"https://{_auth0Settings.Domain}/userinfo");

        return response.StatusCode == HttpStatusCode.OK
            ? CheckForPolicyOutcomes.Success
            : CheckForPolicyOutcomes.Failure;

        //var email = GetUserEmailFromToken(request.Token);
        //if (string.IsNullOrEmpty(email))
        //{
        //    return CheckForPolicyOutcomes.EmailNotConfirmed;
        //}

        //var user = userManager.FindByEmailAsync(email).Result;
        //if (user == null )
        //{
        //    return CheckForPolicyOutcomes.Failure;
        //}

        //var roles = GetUserRoles(request.Token);
        //foreach (var role in roles)
        //{
        //    if (role == requiredRole.ToString())
        //    {
        //        return CheckForPolicyOutcomes.Success;
        //    }
        //}

        //return CheckForPolicyOutcomes.Failure;
    }

    public async Task<CheckForPolicyOutcomes> CheckForCustomerPolicy(CheckForPolicyRequest request)
    {
        return await CheckForPolicy(request, Roles.Customer);
    }

    public async Task<CheckForPolicyOutcomes> CheckForVendorPolicy(CheckForPolicyRequest request)
    {
        return await CheckForPolicy(request, Roles.Vendor);
    }

    public async Task<CheckForPolicyOutcomes> CheckForAdminPolicy(CheckForPolicyRequest request)
    {
        return await CheckForPolicy(request, Roles.Admin);
    }


   


    public async Task<(GetUserInfoOutcomes, IGetUserResponse?)> GetUserInfo(string email)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return (GetUserInfoOutcomes.EmailNotFound, null);
        }
    
        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();
        switch (role){
            case nameof(Roles.Admin): return (GetUserInfoOutcomes.UserIsAdmin, null);
            case nameof(Roles.Customer):
                var customer = await customerRepository.GetByIdAsync(user.Id);
                return customer == null
                    ? (GetUserInfoOutcomes.CustomerNotInitialized, null)
                    : (GetUserInfoOutcomes.Success, mapper.Map<GetCustomerResponse>(customer));
            case nameof(Roles.Vendor):
                var vendor = await vendorRepository.GetByIdAsync(user.Id);
                return vendor == null
                    ? (GetUserInfoOutcomes.VendorNotInitialized, null)
                    : (GetUserInfoOutcomes.Success, mapper.Map<GetVendorResponse>(vendor));
            default: return (GetUserInfoOutcomes.UnknownError, null);
        }
    }

    public async Task<UpdateUserInfoOutcomes> UpdateCustomerInfo(string email, UpdateUserRequest request, string expectedRole)
    {
        var isValid = tokenService.IsTokenValid(request.JwToken);
        if (!isValid)
        {
            return UpdateUserInfoOutcomes.InvalidToken;
        }
        var user = await userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return UpdateUserInfoOutcomes.EmailNotFound;
        }
        
        var roles = await userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault();

        if (role != expectedRole)
        {
            return UpdateUserInfoOutcomes.WrongUserType;
        }
        
        switch (role)
        {
            case nameof(Roles.Admin): return UpdateUserInfoOutcomes.UserIsAdmin;
            case nameof(Roles.Customer):
                var customer = mapper.Map<UpdateCustomerRequest, Customer>((UpdateCustomerRequest) request);
                customer.UserId = user.Id;
                customer.User = user;
                await customerRepository.UpdateAsync(customer);
                return UpdateUserInfoOutcomes.Success;
            case nameof(Roles.Vendor):
                var vendor = mapper.Map<UpdateVendorRequest, Vendor>((UpdateVendorRequest) request);
                vendor.UserId = user.Id;
                vendor.User = user;
                await vendorRepository.UpdateAsync(vendor);
                return UpdateUserInfoOutcomes.Success;
            default: return UpdateUserInfoOutcomes.UnknownError;
        }
    }
}