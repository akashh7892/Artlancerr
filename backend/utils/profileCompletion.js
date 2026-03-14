
const PROFILE_FIELDS = [
  { key: "name", label: "Full Name", tab: "Basic Info", weight: 10 },
  { key: "avatar", label: "Profile Photo", tab: "Basic Info", weight: 15 },
  { key: "bio", label: "Bio", tab: "Basic Info", weight: 10 },
  { key: "artCategory", label: "Primary Role", tab: "Basic Info", weight: 10 },
  { key: "experience", label: "Experience", tab: "Basic Info", weight: 5 },
  { key: "location", label: "Location", tab: "Basic Info", weight: 5 },
  { key: "rates.daily", label: "Daily Rate", tab: "Rates", weight: 15 },
  {
    key: "availability.blockedDates",
    label: "Availability",
    tab: "Availability",
    weight: 15,
  },
  { key: "equipment", label: "Equipment", tab: "Equipment", weight: 15 },
];
// 10+15+10+10+5+5+15+15+15 = 100 ✓

function resolve(obj, dotKey) {
  return dotKey
    .split(".")
    .reduce((acc, k) => (acc != null ? acc[k] : undefined), obj);
}

function isFilled(val) {
  if (val === undefined || val === null || val === "") return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object") return Object.keys(val).length > 0;
  return true;
}

function calcProfileCompletion(profile = {}) {
  let earned = 0;
  const missing = [];

  PROFILE_FIELDS.forEach(({ key, label, tab, weight }) => {
    if (isFilled(resolve(profile, key))) {
      earned += weight;
    } else {
      missing.push({ label, tab, weight });
    }
  });

  return {
    percent: Math.min(Math.round(earned), 100),
    missing,
  };
}

module.exports = { calcProfileCompletion, PROFILE_FIELDS };
