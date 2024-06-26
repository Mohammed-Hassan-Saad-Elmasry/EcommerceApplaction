// import { fileURLToPath } from 'url'
// import path from 'path'
// import dotenv from 'dotenv'
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// dotenv.config({ path: path.join(__dirname, '../../config/.env') })
// import cloudinary from 'cloudinary';


// cloudinary.v2.config({
//     api_key:process.env.api_key,
//     api_secret:process.env.api_secret,
//     cloud_name:process.env.cloud_name,
//     secure: true
// })

// export default cloudinary.v2;


import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

export default cloudinary;
