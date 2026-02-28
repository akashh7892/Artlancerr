import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadFile } from "../../services/api";

const C = {
  border: "rgba(179,169,97,0.25)",
  gold: "#b3a961",
  goldBg: "rgba(179,169,97,0.12)",
  darkText: "#e8e9eb",
  lightText: "#8ba390",
};

export default function ImageUpload({ onUpload, maxSizeMB = 5, accept = "image/*" }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError("");
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB.`);
      return;
    }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const data = await uploadFile(file);
      onUpload?.(data.url, data.public_id);
    } catch (err) {
      setError(err.message || "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setError("");
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block rounded-xl overflow-hidden border border-[rgba(179,169,97,0.25)]">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#b3a961] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={clearPreview}
              className="absolute top-1 right-1 w-7 h-7 rounded-lg flex items-center justify-center bg-black/6 border border-white/20 text-white hover:bg-red-500/80 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors p-6 min-h-[120px]"
          style={{
            borderColor: dragging ? C.gold : C.border,
            background: dragging ? C.goldBg : "rgba(255,255,255,0.02)",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-[rgba(179,169,97,0.12)]">
            <Upload size={22} className="text-[#b3a961]" />
          </div>
          <p className="text-sm font-medium text-[#e8e9eb]">
            Drag & drop or click to upload
          </p>
          <p className="text-xs mt-1 text-[#8ba390]">
            Images only, max {maxSizeMB}MB
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
