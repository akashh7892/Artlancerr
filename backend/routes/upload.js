const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { uploadFile, resolveBucket } = require("../utils/uploadToS3");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client, getSignedUrl } = require("../config/s3");

// GET /api/upload/url - Generate S3 presigned URL for direct frontend upload
router.get("/url", protect, async (req, res) => {
  try {
    const { fileName, fileType, bucket } = req.query;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "fileName and fileType are required query parameters" });
    }

    // Resolve folder logically based on the requested 'bucket' or default to 'uploads'
    const folder = bucket || "uploads";
    
    // Create a safe, unique filename
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedFileName}`;
    const key = `${folder}/${uniqueFileName}`;

    const bucketName = process.env.AWS_S3_BUCKET_NAME || "theflip-user-uploads"; // Fallback for safety

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
      // Optional: ACL: "public-read" if bucket allows ACLs, but our policy handles it
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour expiration

    const region = process.env.AWS_REGION || "ap-south-1";
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return res.json({
      presignedUrl,
      publicUrl,
      key
    });
  } catch (error) {
    console.error("Presigned URL generation error:", error);
    return res.status(500).json({ message: "Could not generate upload URL" });
  }
});

// POST /api/upload - protected multipart upload (LEGACY SUPABASE)
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
