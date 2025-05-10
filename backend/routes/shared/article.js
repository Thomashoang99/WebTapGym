const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');

// Lọc và tìm kiếm bài đăng
router.get('/', async (req, res) => {
  try {
    const { keywords, categories, tags } = req.query;
    const filter = {};

    if (keywords) {
      const keywordList = keywords.split(',').map(k => k.trim());
      filter.$text = { $search: keywordList.join(' ') };
    }

    if (categories) {
      filter.categories = { $all: categories.split(',').map(c => c.trim()) };
    }

    if (tags) {
      filter.tags = { $all: tags.split(',').map(t => t.trim()) };
    }

    const articles = await Article.find(filter).sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json('Lỗi không truy xuất được');
  }
});

// Tìm kiếm bài đăng theo id
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json('Không tìm thấy bài');
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json('Lỗi không truy xuất được');
  }Lo
});
module.exports = router;
