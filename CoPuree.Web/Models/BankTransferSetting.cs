using System.ComponentModel.DataAnnotations;

namespace CoPuree.Web.Models;

public class BankTransferSetting
{
    public int Id { get; set; } = 1;

    [MaxLength(120)]
    public string BankName { get; set; } = "MB Bank";

    [MaxLength(64)]
    public string AccountNumber { get; set; } = "0000000000";

    [MaxLength(160)]
    public string AccountName { get; set; } = "COPUREE";

    [MaxLength(120)]
    public string Branch { get; set; } = "Ho Chi Minh";

    [MaxLength(420)]
    public string QrImageUrl { get; set; } = string.Empty;

    [MaxLength(120)]
    public string TransferContentPrefix { get; set; } = "COPUREE";

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
