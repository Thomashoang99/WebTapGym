const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

// Tạo bài đăng mới
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { title, content, summary, imageUrl, categories, tags } = req.body;
    const article = new Article({
      title,
      content,
      summary,
      imageUrl,
      categories,
      tags,
      createdBy: req.user._id
    });
    await article.save();
    res.status(201).json('Article created');
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Sửa bài đăng
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json('Không tìm thấy bài đăng');
    res.status(200).json({ msg: 'Đã cập nhật'});
  } catch (err) {
    res.status(400).json({ err: err.message || 'Không truy xuất được dữ liệu' });
  }
});

// Xóa bài
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json('Không tìm thấy bài đăng');
    res.status(200).json('Đã xóa bài đăng');
  } catch (err) {
    res.status(500).json('Lỗi không xóa được bài đăng');
  }
});

module.exports = router;
