// import express from 'express';
// import multer from 'multer';
// import bcrypt from 'bcryptjs';
// import   cloudinary  from 'cloudinary';
// import streamifier from 'streamifier';
// import { isAdmin, isAuth } from '../utils.js';

// const upload = multer();

// const uploadRouter = express.Router();

// uploadRouter.post(
//   '/',
//   isAuth,
//   isAdmin,
//   upload.single('file'),
//   async (req, res) => {
//     cloudinary.config({
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       api_secret: process.env.CLOUDINARY_API_SECRET,
//     });
//     const streamUpload = (req) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream((error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         });
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });
//     };
//     const result = await streamUpload(req);
//     res.send(result);
//   }
// );
// export default uploadRouter;


import  express from "express";
const app = express();
import bodyParser from"body-parser";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import stream from "stream";
import dotenv from 'dotenv'

dotenv.config();

const uploadRouter = express.Router();

const CryptoAlgorithm = "aes-256-cbc";

// Obviously keys should not be kept in code, these should be populated with environmental variables or key store
const secret = {
    iv: Buffer.from(`${process.env.IV}`, 'hex'),
    key: Buffer.from(`${process.env.KEY}`, 'hex')
}

app.use(bodyParser.json());

const storage = multer.memoryStorage()
const upload = multer({ storage });

function encrypt(algorithm, buffer, key, iv) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
    return encrypted;
};

function decrypt(algorithm, buffer, key, iv) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
}

function getEncryptedFilePath(filePath) {
  return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + "_encrypted" + path.extname(filePath))
}

function saveEncryptedFile(buffer, filePath, key, iv) {
    const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

    filePath = getEncryptedFilePath(filePath);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath))
    }

    fs.writeFileSync(filePath, encrypted);
  }
  
  function getEncryptedFile(filePath, key, iv) {
    filePath = getEncryptedFilePath(filePath);
    const encrypted = fs.readFileSync(filePath);
    const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
    return buffer;
  }
  
  app.post("/upload", upload.single("file"),  (req, res, next) => {
    console.log("file upload: ", req.file.originalname);
    saveEncryptedFile(req.file.buffer, path.join("./uploads", req.file.originalname), secret.key, secret.iv);
    res.status(201).json( { status: "ok" });
  });
  
  app.get("/file/:fileName", (req, res, next) => {
    console.log("Getting file:", req.params.fileName);
    const buffer = getEncryptedFile(path.join("./uploads", req.params.fileName), secret.key, secret.iv);
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    res.writeHead(200, {
      "Content-disposition": "attachment; filename=" + req.params.fileName,
      "Content-Type": "application/octet-stream",
      "Content-Length": buffer.length
    });
    res.end(buffer);
  });

  export default uploadRouter;




























  
  // app.use(express.static("./public"));