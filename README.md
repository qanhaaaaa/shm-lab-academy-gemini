# SHM Lab & Academy - Springy Gemini Free Edition (Vercel Ready)

## Thay đổi
- Đổi hoàn toàn `api/tutor.js` từ OpenAI sang Google Gemini API `generateContent`, mặc định `gemini-2.5-flash-lite`.
- Vẫn giữ nguyên `public/index.html`, `public/style.css`, `public/script.js`, `public/academy.css` và toàn bộ chế độ Đo thực, Mô phỏng, Kho đề thi.
- Giữ giao diện Springy hiện có, hỗ trợ văn bản và ảnh JPG/PNG/WEBP dưới 4 MB; đưa ra gợi ý, lời giải chi tiết hoặc kiểm tra bài làm.
- Nếu API lỗi, lời giải offline hạn chế vẫn chạy với đề văn bản và **hiển thị lỗi thực tế**; ảnh không thể đọc offline.
- `local/server.js` sử dụng chung handler API với Vercel.

## Cấu hình Vercel (QUAN TRỌNG)
1. Tải nội dung ZIP lên **thư mục gốc repository** qua GitHub (giữ nguyên thư mục `api/`, `public/`, `local/`). Nếu repository đã có các file `index.html`, `style.css`, `academy.js`, `script.js`, `academy.css` cũ ở gốc, nên xóa bản trùng sau khi xác nhận đã có trong `public/`.
2. Vercel Framework Preset: **Other**; Output Directory: **public**; Root Directory: **./**. `vercel.json` cũng khai báo `public`.
3. Trong **Project → Settings → Environment Variables** (không phải Team), thêm:
   - `GEMINI_API_KEY` = giá trị khóa trong Google AI Studio, **Production**.
   - `GEMINI_MODEL` = `gemini-2.5-flash-lite` (tùy chọn).
   - Không cần `OPENAI_API_KEY`, `AI_MODEL`, `AI_API_BASE` nữa; có thể xóa các biến cũ nếu không dùng.
4. Commit/push để tạo deployment mới hoặc Redeploy sau khi thêm biến. KHÔNG commit API key vào repository, không dán vào JS/HTML.
5. Test `https://TEN-MIEN.vercel.app/api/tutor` bằng trình duyệt: sẽ có **405 / Chỉ hỗ trợ POST**, bình thường. Gửi đề bằng nút Hỏi Springy mới là POST thật.

## Chạy local Windows
Cài Node >=20; trong CMD: `set GEMINI_API_KEY=...` (chỉ trong phiên CMD), rồi chạy `node local/server.js` hoặc `npm start`.
Mở http://localhost:4173. Không chia sẻ ảnh màn hình có khóa, không đưa `.env` lên GitHub.

## Thử API không cần khóa thật
- `node --check api/tutor.js`
- `node --check public/academy.js`
- POST không có khóa: HTTP 503 + `MISSING_GEMINI_KEY`.
- Với khóa hợp lệ và còn quota: POST trả `answer`, `model`, `provider: gemini` và có thể có `simulation`.
- Nếu Free Tier hết quota: HTTP 429, thông báo rõ `GEMINI_QUOTA`; frontend hiển thị lỗi và giải offline (với đề văn bản).

## Giới hạn và an toàn
- Free Tier phụ thuộc vào **project, khu vực, tài khoản và hạn mức hiện hành**; không bảo đảm 100% miễn phí/luôn khả dụng cho mọi tài khoản. Xem giới hạn trong Google AI Studio.
- Nội dung/ảnh gửi lên Google Gemini API; tránh thông tin cá nhân nhạy cảm của học sinh và đọc điều khoản sử dụng Free Tier.
- Rate limiter đang dùng bộ nhớ của mỗi serverless instance (8 yêu cầu/phút/IP) và **không phải bảo vệ toàn cục**. Khi công khai rộng rãi cần thêm login, rate limit lưu trữ tập trung, giới hạn chi phí và chống bot. API key chỉ ở server.
- Chưa fine-tune mô hình; chuyên biệt hóa bằng prompt kiến thức và phép kiểm chứng công thức.
- Đo thực Web Serial cần Chrome/Edge HTTPS và ESP32 nối USB, cần kiểm tra thực tế trên phần cứng.
