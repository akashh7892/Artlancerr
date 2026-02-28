export default function LoadingSpinner({ fullPage = false, className = "" }) {
  const spinner = (
    <div
      className={`w-10 h-10 border-2 border-[#b3a961] border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1d24]">
        {spinner}
      </div>
    );
  }
  return spinner;
}
