# Hướng dẫn cấu hình file .env cho Backend

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/schedule18

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d

# Google OAuth2
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@schedule18.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## Hướng dẫn lấy thông tin:

1. **MongoDB URI**: Nếu dùng MongoDB Compass local, giữ nguyên `mongodb://localhost:27017/schedule18`

2. **JWT_SECRET**: Tạo một chuỗi bí mật ngẫu nhiên (ít nhất 32 ký tự)

3. **Google OAuth2**:
   - Vào https://console.cloud.google.com/
   - Tạo project mới hoặc chọn project
   - Vào "APIs & Services" > "Credentials"
   - Tạo "OAuth 2.0 Client ID"
   - Thêm authorized redirect URIs: `http://localhost:5173`
   - Copy Client ID và Client Secret

4. **Email (Nodemailer)**:
   - Nếu dùng Gmail, cần tạo "App Password"
   - Vào Google Account > Security > 2-Step Verification > App passwords
   - Tạo app password cho "Mail"
   - Dùng app password này cho EMAIL_PASS

