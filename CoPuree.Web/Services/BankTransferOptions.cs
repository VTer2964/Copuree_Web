namespace CoPuree.Web.Services;

public class BankTransferOptions
{
    public string BankName { get; set; } = "Ngan hang cua ban";

    public string AccountNumber { get; set; } = "0000000000";

    public string AccountName { get; set; } = "COPUREE";

    public string Branch { get; set; } = "Ho Chi Minh";

    public string QrImageUrl { get; set; } = string.Empty;
}
