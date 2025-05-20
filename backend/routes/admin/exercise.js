const express = require('express');
const Exercise = require('../../models/Exercise');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/admin');
const upload = require('../../middleware/upload');
const router = express.Router();

 // Thêm bài tập
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, bodyParts, equipment, difficulty, videoUrl } = req.body;
    const newExercise = new Exercise({
      name: name,
      description: description,
      bodyParts: bodyParts,
      equipment: equipment,
      difficulty: difficulty,
      videoUrl: videoUrl
    });
    if (req.file) {
        newExercise.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    await newExercise.save();
    res.status(201).json({ msg: 'New exercise created' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Sửa bài tập
router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, bodyParts, equipment, difficulty, videoUrl } = req.body;
    const updateData = {
      name: name,
      description: description,
      bodyParts: bodyParts,
      equipment: equipment,
      difficulty: difficulty,
      videoUrl: videoUrl
    };
    if (req.file) {
        updateData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id, 
      updateData, {
      new: true, runValidators: true
    });
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise does not exist' });
    }
    res.status(200).json(exercise);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Can\'t modify exercise' });
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
