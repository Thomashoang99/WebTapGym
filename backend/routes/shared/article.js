const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');

router.get('/', async (req, res) => {
  try {
    const {
      keywords,
      categories,
      tags,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (keywords) {
      const kw = keywords.split(',').map(k => k.trim());
      filter.$text = { $search: kw.join(' ') };
    }
    if (categories) {
      filter.categories = { $all: categories.split(',').map(c => c.trim()) };
    }
    if (tags) {
      filter.tags = { $all: tags.split(',').map(t => t.trim()) };
    }

    const pageNum = parseInt(page, 10);
    const lim     = Math.min(parseInt(limit, 10), 100);
    const skip    = (pageNum - 1) * lim;
    const dir     = sortOrder === 'asc' ? 1 : -1;
    const valid   = ['title', 'createdAt'];
    const sortKey = valid.includes(sortBy) ? sortBy : 'createdAt';

    const total   = await Article.countDocuments(filter);
    const results = await Article.find(filter)
      .sort({ [sortKey]: dir, _id: dir })
      .skip(skip)
      .limit(lim);

    res.status(200).json({
      page: pageNum,
      totalPages: Math.ceil(total / lim),
      total,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Error fetching articles');
  }
});


// Search by id
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json('This article does not exist.');
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json('Server error');
  }
});
module.exports = router;
