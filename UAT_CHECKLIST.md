# CoPuree Web App - UAT Checklist

Ngay kiem thu: 2026-05-27

Muc tieu: xac nhan web app da du chay pilot ban hang that voi nhom khach nho, va chi ra cac diem can hoan thien truoc khi mo public rong.

## Ket Luan Nhanh

Trang thai hien tai: **Dat muc pilot noi bo / ban thu co kiem soat**.

Chua nen mo public rong hoac chay quang cao lon cho den khi hoan thien cac muc bat buoc trong phan "Can chot truoc public".

## Vai Tro Va Nghiep Vu

### Khach Hang

- [x] Xem trang chu, san pham va chi tiet san pham.
- [x] Gia, ten, mo ta, ton kho lay tu backend that.
- [x] Dat hang COD.
- [x] Dat hang chuyen khoan.
- [x] Xem trang dat hang thanh cong.
- [x] Xem thong tin chuyen khoan va noi dung chuyen khoan theo ma don.
- [x] Tra cuu don hang bang ma don va so dien thoai.
- [x] Dang nhap tai khoan bang so dien thoai va OTP mock.
- [x] Xem lich su don hang.
- [x] Xem diem tich luy.
- [x] Them dia chi giao hang.
- [x] Checkout tu dong nap dia chi da luu theo so dien thoai.

### Admin Shop

- [x] Dang nhap admin bang mat khau.
- [x] Xem danh sach don hang.
- [x] Loc don theo ma don, ten khach, so dien thoai, email.
- [x] Loc don theo trang thai don.
- [x] Loc don theo trang thai thanh toan.
- [x] Cap nhat trang thai don hang.
- [x] Cap nhat trang thai thanh toan.
- [x] Xem chi tiet don hang.
- [x] Export CSV theo bo loc hien tai.
- [x] Xem danh sach khach hang.
- [x] Xem chi tiet khach hang, don hang, dia chi, diem tich luy.
- [x] Dieu chinh diem tich luy thu cong.
- [x] Quan ly san pham: ten, slug, mo ta, gia, ton kho, anh, noi bat.
- [x] An/hien san pham tren storefront.
- [x] Cau hinh thong tin chuyen khoan.

### Chu Shop

- [x] Theo doi don cho xac nhan va don dang xu ly.
- [x] Theo doi doanh thu theo bo loc.
- [x] Theo doi ton kho va canh bao sap het hang.
- [x] An san pham demo/cu nhung van giu lich su don.
- [x] Co nen tang diem khi don hoan tat.
- [ ] Co dashboard tong hop theo ngay/tuan/thang.
- [ ] Co thong bao don moi qua email/Zalo/SMS.

## Ket Qua Test Thuc Te

### Build Va API

- [x] `.NET build` thanh cong.
- [x] `Next.js build` thanh cong khi backend dang chay.
- [x] API `/api/products` chi tra san pham dang ban.
- [x] API san pham an tra `404`.
- [x] API tao don hang thanh cong.
- [x] API cau hinh chuyen khoan tra dung du lieu.
- [x] Scan source chinh khong con mau loi font tieng Viet kieu `Ã`, `áº`, `á»`.

### Test Data Da Dung

- San pham that: `copuree-dau-dua-tinh-khiet-ep-lanh`.
- Gia test: `149000`.
- Don test moi gan day: `CP260526181848`.
- So dien thoai test tai khoan: `0339818937`.
- So dien thoai test dia chi tu dong: `0900000526`, `0900000527`, `0900000528`.
- OTP mock: `123456`.

## Can Chot Truoc Public

Bat buoc:

- [ ] Thay OTP mock bang SMS/Zalo ZNS that, hoac tam thoi an mo ta "OTP" neu chua gui that.
- [ ] Cap nhat thong tin ngan hang that: ngan hang, so tai khoan, chu tai khoan, anh QR.
- [ ] Doi mat khau admin mac dinh `ChangeMeNow!`.
- [ ] Chot chinh sach van chuyen/freeship va logic phi ship.
- [ ] Viet/chot noi dung chinh sach: van chuyen, doi tra, bao mat, dieu khoan mua hang.
- [ ] Them co che backup database.
- [ ] Chot domain production va cau hinh CORS domain that.

Nen co truoc khi chay quang cao:

- [ ] Email/Zalo/SMS bao don moi cho chu shop.
- [ ] Email/SMS xac nhan don cho khach.
- [ ] Dashboard doanh thu theo ngay/tuan/thang.
- [ ] Trang blog/huong dan su dung dau dua de tang SEO.
- [ ] Pixel/analytics: Meta Pixel, Google Analytics, conversion event.
- [ ] Log loi va theo doi uptime.

## Luong Nghiep Vu Chuan De Van Hanh Pilot

1. Admin vao `/admin/san-pham`, kiem tra san pham dang ban, gia va ton kho.
2. Admin vao `/admin/thanh-toan`, cap nhat thong tin ngan hang/QR neu co.
3. Khach vao storefront, xem san pham va dat hang.
4. Neu khach chon COD, admin goi xac nhan don.
5. Neu khach chon chuyen khoan, khach xem noi dung chuyen khoan o trang thanh cong.
6. Admin vao `/admin/don-hang`, loc don moi va cap nhat trang thai.
7. Khi don hoan tat, admin chuyen trang thai `Hoan tat` va thanh toan `Da thanh toan`.
8. He thong tu cong diem tich luy cho khach.
9. Khach vao `/tai-khoan`, xac minh so dien thoai bang OTP mock va xem lich su don.

## Rủi Ro Con Lai

- OTP mock phu hop demo, khong phu hop public neu can bao mat tai khoan khach hang.
- Chuyen khoan hien la doi soat thu cong, khong tu dong xac nhan tien vao.
- Phi ship dang la `0` o backend order API, can chot truoc khi ban xa.
- Next build phu thuoc backend dang chay vi co prerender du lieu san pham tu API.
- SQLite phu hop pilot nho, nhung public lau dai nen can chien luoc backup hoac chuyen PostgreSQL/SQL Server.
