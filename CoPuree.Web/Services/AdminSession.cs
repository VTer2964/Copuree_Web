namespace CoPuree.Web.Services;

public class AdminSession(
    IHttpContextAccessor httpContextAccessor,
    IConfiguration configuration,
    IWebHostEnvironment environment)
{
    private const string AdminSessionKey = "copuree.admin";
    private const string DefaultDevelopmentPassword = "ChangeMeNow!";

    public bool IsAuthenticated =>
        httpContextAccessor.HttpContext?.Session.GetString(AdminSessionKey) == "true";

    public bool SignIn(string password)
    {
        var configuredPassword = configuration["Admin:Password"];
        if (string.IsNullOrWhiteSpace(configuredPassword))
        {
            return false;
        }

        if (!environment.IsDevelopment() &&
            string.Equals(configuredPassword, DefaultDevelopmentPassword, StringComparison.Ordinal))
        {
            return false;
        }

        if (!string.Equals(password, configuredPassword, StringComparison.Ordinal))
        {
            return false;
        }

        httpContextAccessor.HttpContext?.Session.SetString(AdminSessionKey, "true");
        return true;
    }

    public void SignOut()
    {
        httpContextAccessor.HttpContext?.Session.Remove(AdminSessionKey);
    }
}
