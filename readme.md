# WebTapGym - Website cho người tập thể hình

## Tech Stack
**Frontend:** Vue 3, Pinia, Vue Router, Axios, Quill.js    
**Backend:** Node.js, Express, JWT, Multer    
**Database:** MongoDB + Mongoose  

## Tính năng:
### Cho người dùng:
- Quản lý hồ sơ cá nhân
- Tìm kiếm và lọc bài tập, chương trình tập luyện, tin tức
- Ghi chú tiến độ tập luyện theo từng chương trình
- Ghi chú chiều cao, cân nặng và BMI theo ngày

## Hướng dẫn cài đặt
# Clone về máy
git clone https://github.com/Thomashoang99/WebTapGym
cd WebTapGym
npm run install

# Seed dữ liệu cho backend
cd backend
node seeds/master.js

# Chạy backend:
cd backend
npm run dev

# Chạy frontend user & admin:
**User**: cd frontend && npm run dev
**Admin**: cd admin && npm run dev
