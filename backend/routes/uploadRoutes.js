import express from 'express';
import multer from 'multer';
const router = express.Router();
import path from 'path';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

// see npm multer diskstorage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      // you dont need the dot
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

//custom cb validation
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    //null means no error
    //theres no 404 error here
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  //storage:storage
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

const returnImageUrl = (req, res) => {
  //removes backslash
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
};

//single file upload
router
  .route('/')
  .post(protect, isAdmin, upload.single('image'), returnImageUrl);

export default router;
