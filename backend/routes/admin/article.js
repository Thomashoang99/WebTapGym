const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');
const upload = require('../../middleware/upload');

// Create new article
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, content, summary, categories, tags } = req.body;
    const article = new Article({
      title: title,
      content: content,
      summary: summary,
      categories: categories,
      tags: tags,
    });
    if (req.file) {
        article.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    await article.save();
    res.status(201).json('Article created');
  } catch (err) {
    res.status(400).json('Can\'t create new article');
  }
});

// Modify an article
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, content, summary, categories, tags } = req.body;
    const update = {
      title: title,
      content: content,
      summary: summary,
      categories: categories,
      tags: tags
    }
    if (req.file) {
        update.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!article){
      return res.status(404).json('Article not found');
    }
    res.status(200).json({ msg: 'Update complete'});
  } catch (err) {
  console.error('Create Article Error:', err);
  // send back the full validation errors if any
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  res.status(400).json({ error: err.message });
}
});

// Delete
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article){ 
      return res.status(404).json('Article not found');
    }
    res.status(200).json('Delete complete');
  } catch (err) {
    res.status(500).json('Sercer error');
  }
});

module.exports = router;