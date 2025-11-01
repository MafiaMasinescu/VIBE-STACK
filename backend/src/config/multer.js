import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Store in backend/uploads folder
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: function (req, file, cb) {
        // Create unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
    
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Check if it's an image
    if (
        allowedImageTypes.test(extname.slice(1)) &&
        mimetype.startsWith("image/")
    ) {
        return cb(null, true);
    }
    
    // Check if it's a video
    if (
        allowedVideoTypes.test(extname.slice(1)) &&
        mimetype.startsWith("video/")
    ) {
        return cb(null, true);
    }

    cb(new Error("Only image and video files are allowed!"));
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
    },
});

export default upload;
