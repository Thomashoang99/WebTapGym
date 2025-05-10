const express = require('express');
const Bookmark = require('../../models/Bookmark');
const auth = require('../../middleware/auth');
const router = express.Router();

// Lấy dữ liệu bookmark
router.get('/', auth, async (req, res) => {
    try {
        const user = req.user._id;
        const bookmarks = await Bookmark.find({ user: user })
        .sort({ createdAt: -1 })
        .populate([{ path: 'program', select: 'name' }, { path: 'exercise' }]);
        res.status(200).json(bookmarks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch bookmark' });
    }
  });

//Tạo bookmark
router.post('/', auth, async (req, res) => {
    try {
        const user = req.user._id;
        const { programId, exerciseId } = req.body;

        if (programId && exerciseId) {
            return res.status(400).json("Can't bookmark program and exercise at once");
          }

        const isAlreadyBookmarked = await Bookmark.findOne({
            user,
            ...(programId && { program: programId }),
            ...(exerciseId && { exercise: exerciseId })
          });
        if (isAlreadyBookmarked) {
            return res.status(409).json({ error: 'Already bookmarked' });
        }  

        const bookmark = new Bookmark({
            user: user,
            program: programId || null,
            exercise: exerciseId || null
        })
        await bookmark.save();
        res.status(201).json({
            msg: 'Bookmark created',
            bookmark: bookmark
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create bookmark' });
    }
})

//Xóa bookmark theo  id
router.delete('/:id', auth, async (req, res) => {
    try {
        const bookmarkId = req.params.id;
        const user = req.user._id;

        const bookmark = await Bookmark.findById(bookmarkId);
        if (!bookmark){
            return res.status(404).json('Bookmark not found');
        }
        if (user.toString() !== bookmark.user.toString()){
            return res.status(403).json('Unauthorized');
        }

        await bookmark.deleteOne();
        res.status(200).json('Bookmark successfuly deleted');
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
})

//Xóa bookmark theo bài tập/bài đăng được bookmark
router.delete('/', auth, async (req, res) => {
    try {
      const user = req.user._id;
      const { programId, exerciseId } = req.body;
  
      const result = await Bookmark.findOneAndDelete({
        user,
        ...(programId && { program: programId }),
        ...(exerciseId && { exercise: exerciseId })
      });
  
      if (!result) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }
  
      res.status(200).json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete bookmark' });
    }
  });

// Kiểm tra đã bookmark chưa
router.get('/check', auth, async (req, res) => {
    try {
      const user = req.user._id;
      const { programId, exerciseId } = req.query;
  
      const bookmark = await Bookmark.findOne({
        user,
        ...(programId && { program: programId }),
        ...(exerciseId && { exercise: exerciseId })
      });
  
      res.status(200).json({ bookmarked: !!bookmark });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to check bookmark status' });
    }
  });

module.exports = router;