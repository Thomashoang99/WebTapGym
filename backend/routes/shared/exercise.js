const express = require('express');
const Exercise = require('../../models/Exercise');
const router = express.Router();

// Lọc bài tập
router.get('/', async (req, res) => {
  try {
    const parseValues = (str) => str.split(',').map(s => s.trim());
    const { 
      keywords, bodyParts, equipment, difficulty, 
      page = 1, limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};
    if (keywords) {
      const keywordList = parseValues(keywords);
      filter.$and = keywordList.map(keyword => ({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ]
      }));
    }

    if (bodyParts) {
      filter.bodyParts = { $all: parseValues(bodyParts) };
    }

    if (equipment) {
      filter.equipment = equipment;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const validSortCriteria = ['name', 'createdAt'];
    const finalSortBy = validSortCriteria.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'desc' ? -1 : 1;

    const _page =  parseInt(page); const _limit = parseInt(limit);
    const skip = (_page - 1) * _limit;
    const count = await Exercise.countDocuments(filter);

    const exercises = await Exercise.find(filter)
    .sort({ 
      [finalSortBy]: order,
      _id: order })
    .skip(skip).limit(_limit);

    res.status(200).json({
      page: _page,
      totalPages: Math.ceil(count / limit),
      count: count,
      results: exercises
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể lấy được dữ liệu bài tập' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Bài tập không tồn tại' });
    }
    res.status(200).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể lấy được dữ liệu bài tập' });
  }
});

module.exports = router;
