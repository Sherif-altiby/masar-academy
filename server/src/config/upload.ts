import fs from "fs";
import path from "path";

import multer from "multer";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const PDF_DIR = path.join(UPLOADS_ROOT, "pdfs");
const IMAGE_DIR = path.join(UPLOADS_ROOT, "images");

for (const dir of [PDF_DIR, IMAGE_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

function makeStorage(destination: string) {
  return multer.diskStorage({
    destination,
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });
}

export const uploadPdf = multer({
  storage: makeStorage(PDF_DIR),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("PDF_ONLY"));
      return;
    }
    cb(null, true);
  },
});

export const uploadImage = multer({
  storage: makeStorage(IMAGE_DIR),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("IMAGE_ONLY"));
      return;
    }
    cb(null, true);
  },
});

export function publicPathFor(kind: "pdfs" | "images", filename: string): string {
  return `/uploads/${kind}/${filename}`;
}

export const UPLOADS_STATIC_ROOT = UPLOADS_ROOT;
