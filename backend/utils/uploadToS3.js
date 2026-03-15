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

const normalizeBaseUrl = (value) => {
  if (!value) return null;
  return String(value).trim().replace(/\/+$/, "");
};

const PUBLIC_BASE_URL =
  normalizeBaseUrl(process.env.AWS_S3_PUBLIC_BASE_URL) ||
  (BUCKET && REGION ? `https://${BUCKET}.s3.${REGION}.amazonaws.com` : null);

const hasStaticCredentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

const s3Config = {
  region: REGION,
  ...(hasStaticCredentials
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      }
    : {}),
};

const s3 = new S3Client(s3Config);

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
  if (!REGION || !BUCKET) {
    throw new Error("AWS S3 is not configured (missing AWS_REGION/AWS_S3_BUCKET)");
  }
  if (!PUBLIC_BASE_URL) {
    throw new Error("AWS S3 public base URL is not configured");
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
