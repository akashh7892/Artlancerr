import { useEffect, useState } from "react";

const types = {
  success: "bg-green-500/90 text-white",
  error: "bg-red-500/90 text-white",
  info: "bg-[#b3a961]/90 text-[#1a1d24]",
};

export default function Toast({ message, type = "info", duration = 4000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-lg ${types[type] || types.info}`}
      role="alert"
    >
      {message}
    </div>
  );
}
