import * as tf from '@tensorflow/tfjs-node';
import { Router } from 'express';
import multer from 'multer';
import * as nsfw from 'nsfwjs';
import sharp from 'sharp';

import authorization from '../../middleware/authorization';

const MODEL_NAME = process.env.MODEL || 'MobileNetV2';
const model = await nsfw.load(MODEL_NAME);
console.log(`Loaded model: ${MODEL_NAME}`);

const MAX_FILE_SIZE =
  (process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 25) *
  1024 *
  1024;

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter(req, file, callback) {
    const allowedTypes = /jpeg|jpg|png/;

    if (!allowedTypes.test(file.mimetype)) return callback(null, false);

    return callback(null, true);
  },
});

router.post(
  '/upload',
  authorization,
  upload.single('image'),
  async (req, res) => {
    if (!req.file)
      return res
        .status(400)
        .json({
          message: 'missing image',
        })
        .end();

    try {
      const image = await sharp(req.file.buffer).png().toBuffer();
      const decodedImage = tf.node.decodeImage(new Uint8Array(image), 3);

      const result = await model.classify(decodedImage);
      const probabilities = Object.fromEntries(
        result.map((prediction) => [
          prediction.className,
          prediction.probability,
        ]),
      );

      decodedImage.dispose();

      res
        .json({
          message: 'success',
          probabilities,
        })
        .end();
    } catch (err) {
      console.error(err);

      res
        .status(500)
        .json({
          message: 'server error',
        })
        .end();
    }
  },
);

export default router;
