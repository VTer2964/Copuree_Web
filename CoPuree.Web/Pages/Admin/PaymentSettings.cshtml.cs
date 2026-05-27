using System.ComponentModel.DataAnnotations;
using CoPuree.Web.Data;
using CoPuree.Web.Models;
using CoPuree.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace CoPuree.Web.Pages.Admin;

public class PaymentSettingsModel(AppDbContext db, AdminSession adminSession) : PageModel
{
    [BindProperty]
    public string Password { get; set; } = string.Empty;

    [BindProperty]
    public PaymentSettingInput Input { get; set; } = new();

    public bool IsAuthenticated => adminSession.IsAuthenticated;

    public string? ErrorMessage { get; set; }

    public string? SuccessMessage { get; set; }

    public async Task OnGetAsync()
    {
        if (IsAuthenticated)
        {
            await LoadSettingAsync();
        }
    }

    public async Task<IActionResult> OnPostLoginAsync()
    {
        if (!adminSession.SignIn(Password))
        {
            ErrorMessage = "Mật khẩu admin không đúng.";
            return Page();
        }

        await LoadSettingAsync();
        return Page();
    }

    public IActionResult OnPostLogout()
    {
        adminSession.SignOut();
        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostSaveAsync()
    {
        if (!IsAuthenticated)
        {
            return RedirectToPage();
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        var setting = await db.BankTransferSettings.FirstOrDefaultAsync();
        if (setting is null)
        {
            setting = new BankTransferSetting { Id = 1 };
            db.BankTransferSettings.Add(setting);
        }

        setting.BankName = Input.BankName.Trim();
        setting.AccountNumber = Input.AccountNumber.Trim();
        setting.AccountName = Input.AccountName.Trim();
        setting.Branch = Input.Branch.Trim();
        setting.QrImageUrl = Input.QrImageUrl.Trim();
        setting.TransferContentPrefix = Input.TransferContentPrefix.Trim();
        setting.UpdatedAtUtc = DateTime.UtcNow;

        await db.SaveChangesAsync();
        SuccessMessage = "Đã lưu cấu hình thanh toán.";
        await LoadSettingAsync();
        return Page();
    }

    private async Task LoadSettingAsync()
    {
        var setting = await db.BankTransferSettings.AsNoTracking().FirstOrDefaultAsync()
            ?? new BankTransferSetting();
        Input = PaymentSettingInput.FromSetting(setting);
    }
}

public class PaymentSettingInput
{
    [Required(ErrorMessage = "Nhập tên ngân hàng")]
    public string BankName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập số tài khoản")]
    public string AccountNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập chủ tài khoản")]
    public string AccountName { get; set; } = string.Empty;

    public string Branch { get; set; } = string.Empty;

    public string QrImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nhập tiền tố nội dung chuyển khoản")]
    public string TransferContentPrefix { get; set; } = "COPUREE";

    public static PaymentSettingInput FromSetting(BankTransferSetting setting) => new()
    {
        BankName = setting.BankName,
        AccountNumber = setting.AccountNumber,
        AccountName = setting.AccountName,
        Branch = setting.Branch,
        QrImageUrl = setting.QrImageUrl,
        TransferContentPrefix = setting.TransferContentPrefix
    };
}
