const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase");

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

  return process.env.SUPABASE_DEFAULT_BUCKET || "portfolios";
};

const uploadFile = async (bucket, file) => {
  if (!file || !file.buffer) {
    throw new Error("Missing file buffer for upload");
  }

  const safeName = String(file.originalname || "file").replace(/[^\w.\-]/g, "_");
  const fileName = `${uuidv4()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(fileName, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return {
    url: data.publicUrl,
    key: fileName,
  };
};

module.exports = {
  uploadFile,
  resolveBucket,
};
