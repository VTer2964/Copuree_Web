"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Mock API call
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-6 sm:p-8 rounded-[16px] shadow-sm">
      {status === "success" ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center w-12 h-12 bg-[#173d2f] text-white rounded-full text-xl mb-4 font-black">
            &check;
          </div>
          <h3 className="text-2xl font-black text-[#173d2f]">Gửi thông tin thành công!</h3>
          <p className="mt-3 text-sm text-[#5c6a60]">
            Cảm ơn bạn đã liên hệ. Đội ngũ CSKH CoPuree sẽ gọi điện tư vấn cho bạn trong vòng 15-30 phút.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex rounded-[6px] bg-[#173d2f] px-5 py-2 text-sm font-black text-white hover:bg-[#b8752a]"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-[#173d2f] mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#fbfaf6] border border-[#173d2f]/15 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:border-[#b8752a] text-[#173d2f]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-[#173d2f] mb-2">
                Số điện thoại *
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="Ví dụ: 0912345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#fbfaf6] border border-[#173d2f]/15 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:border-[#b8752a] text-[#173d2f]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-[#173d2f] mb-2">
                Email (Không bắt buộc)
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ví dụ: name@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#fbfaf6] border border-[#173d2f]/15 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:border-[#b8752a] text-[#173d2f]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-[#173d2f] mb-2">
              Lời nhắn tư vấn *
            </label>
            <textarea
              id="message"
              required
              rows={4}
              placeholder="Bạn cần tư vấn về cách dưỡng tóc trị rụng, dưỡng ẩm da hay chính sách mua sỉ?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#fbfaf6] border border-[#173d2f]/15 rounded-[6px] px-4 py-3 text-sm focus:outline-none focus:border-[#b8752a] text-[#173d2f] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full inline-flex items-center justify-center bg-[#173d2f] hover:bg-[#b8752a] text-white font-black text-sm py-4 rounded-[6px] transition-colors shadow-lg shadow-[#173d2f]/10"
          >
            {status === "submitting" ? "Đang gửi..." : "Gửi thông tin yêu cầu tư vấn"}
          </button>
        </form>
      )}
    </div>
  );
}
