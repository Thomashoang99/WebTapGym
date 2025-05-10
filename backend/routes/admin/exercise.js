const express = require('express');
const Exercise = require('../../models/Exercise');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');
const router = express.Router();

 // Thêm bài tập
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    await newExercise.save();
    res.status(201).json({ msg: 'Đã tạo bài tập mới' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Sửa bài tập
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }

    res.status(200).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể xóa được bài tập' });
  }
});

// Xóa bài tập
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Không tìm thấy bài tập' });
    }
    res.status(200).json({ msg: 'Đã xóa bài tập' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không thể xóa được bài tập' });
  }
});

module.exports = router;
