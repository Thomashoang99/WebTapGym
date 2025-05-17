const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');

// Create new article
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
    });
    await article.save();
    res.status(201).json('Article created');
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Modify an article
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json('Article not found');
    res.status(200).json({ msg: 'Update complete'});
  } catch (err) {
    res.status(400).json({ err: err.message || 'Server error' });
  }
});

// Delete
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json('Article not found');
    res.status(200).json('Delete complete');
  } catch (err) {
    res.status(500).json('Sercer error');
  }
});

module.exports = router;
