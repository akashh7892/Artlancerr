const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const VALID_BUCKETS = new Set(["profile-images", "portfolios", "chat-files"]);

const mapBucketAlias = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;

  if (VALID_BUCKETS.has(normalized)) return normalized;
  if (normalized.includes("profile") || normalized.includes("avatar")) {
    return "profile-images";
  }
  if (normalized.includes("portfolio") || normalized.includes("document")) {
    return "portfolios";
  }
  if (
    normalized.includes("chat") ||
    normalized.includes("message") ||
    normalized.includes("attachment")
  ) {
    return "chat-files";
  }

  return null;
};

const resolveBucket = (inputs = {}) => {
  const candidates = [
    inputs.bucket,
    inputs.type,
    inputs.context,
    inputs.target,
    inputs.purpose,
    inputs.fieldName,
  ];

  for (const candidate of candidates) {
    const mapped = mapBucketAlias(candidate);
    if (mapped) return mapped;
  }

  return "portfolios";
};

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const PUBLIC_BASE_URL =
  process.env.AWS_S3_PUBLIC_BASE_URL ||
  `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketToPrefix = (bucket) => {
  if (bucket === "profile-images") return "profile";
  if (bucket === "portfolios") return "portfolios";
  if (bucket === "chat-files") return "messages";
  return "misc";
};

const uploadFile = async (bucket, file) => {
  if (!file || !file.buffer) {
    throw new Error("Missing file buffer for upload");
  }

  const safeName = String(file.originalname || "file").replace(/[^\w.\-]/g, "_");
  const key = `${bucketToPrefix(bucket)}/${uuidv4()}-${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    url: `${PUBLIC_BASE_URL}/${key}`,
    key,
  };
};

module.exports = { uploadFile, resolveBucket };
