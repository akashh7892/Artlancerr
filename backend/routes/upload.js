const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { uploadFile, resolveBucket } = require("../utils/uploadToS3");

// POST /api/upload - protected multipart upload
router.post(
  "/",
  protect,
  upload.any(),
  async (req, res) => {
    try {
      const file = Array.isArray(req.files) ? req.files[0] : req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const bucket = resolveBucket({
        bucket: req.body?.bucket || req.query?.bucket,
        type: req.body?.type || req.query?.type,
        context: req.body?.context,
        target: req.body?.target,
        purpose: req.body?.purpose,
        fieldName: file.fieldname,
      });

      if (bucket === "profile-images" && !String(file.mimetype || "").startsWith("image/")) {
        return res.status(400).json({ message: "Profile photo must be an image" });
      }

      const { url, key } = await uploadFile(bucket, file);

      return res.json({
        url,
        public_id: key,
      });
    } catch (error) {
      console.error("Upload error:", error);
      const message =
        error?.message &&
        /AWS S3|S3 public base URL|Missing file buffer/i.test(error.message)
          ? error.message
          : "Upload failed";
      return res.status(500).json({ message });
    }
  }
);

module.exports = router;
