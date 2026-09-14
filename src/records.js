// Records use local calendar dates so late-night entries stay in the correct month.
export function localDateString(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function parseAmount(value) {
  const text = String(value ?? "").trim();
  if (!/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(text)) return null;
  const [whole, fraction = ""] = text.split(".");
  const cents = Number(whole || "0") * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 ? cents / 100 : null;
}

export function dateParts(value) {
  if (typeof value !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return { year, month: month - 1 };
}

export function validateRecord(draft, today = localDateString()) {
  const amount = parseAmount(draft.amount);
  if (amount === null) return { error: "invalidAmount", field: "amount" };
  const parts = dateParts(draft.date);
  if (!parts || draft.date > today) return { error: "invalidDate", field: "date" };
  if (typeof draft.category !== "string" || !draft.category.trim()) return { error: "invalidCategory", field: "category" };
  return { amount, ...parts };
}

const emptyMonth = () => ({ earnings: [], expenses: [] });
const emptyYear = () => Object.fromEntries(Array.from({ length: 12 }, (_, month) => [month, emptyMonth()]));
const recordKey = kind => {
  if (kind !== "earning" && kind !== "expense") throw new Error("Unknown record type");
  return kind === "earning" ? "earnings" : "expenses";
};

// The origin includes its month and year; legacy IDs can repeat across years.
export function removeRecord(data, kind, origin) {
  const key = recordKey(kind);
  const year = data[origin.sourceYear];
  const month = year?.[origin.sourceMonth];
  if (!month) return data;
  return {
    ...data,
    [origin.sourceYear]: {
      ...year,
      [origin.sourceMonth]: { ...month, [key]: month[key].filter(record => record.id !== origin.id) },
    },
  };
}

export function writeRecord(data, kind, record, origin = null) {
  const parts = dateParts(record.date);
  if (!parts) throw new Error("Invalid record date");
  const key = recordKey(kind);
  const next = origin ? removeRecord(data, kind, origin) : data;
  const year = next[parts.year] || emptyYear();
  const month = year[parts.month] || emptyMonth();
  if (month[key].some(existing => existing.id === record.id)) throw new Error("Duplicate record ID in destination month");
  // Display metadata must not become part of the saved record.
  const { sourceYear, sourceMonth, month: monthLabel, ...entry } = record;
  return {
    ...next,
    [parts.year]: {
      ...year,
      [parts.month]: { ...month, [key]: [...month[key], entry] },
    },
  };
}

export function recordsForPeriod(data, year, month, kind) {
  const key = recordKey(kind);
  const months = month === "all" ? Array.from({ length: 12 }, (_, i) => i) : [Number(month)];
  return months.flatMap(index => (data[year]?.[index]?.[key] || []).map(record => ({
    ...record, sourceYear: Number(year), sourceMonth: index,
  }))).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function filterRecords(records, { query = "", category = "", sort = "newest", categoryNames = {} } = {}) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filtered = records.filter(record => {
    const name = record.category || "Other";
    const haystack = [record.label, name, categoryNames[name], record.date, record.amount].join(" ").toLocaleLowerCase();
    return (!category || name === category) && terms.every(term => haystack.includes(term));
  });
  const byDate = (a, b) => (b.date || "").localeCompare(a.date || "");
  return filtered.sort((a, b) => {
    if (sort === "oldest") return -byDate(a, b);
    if (sort === "highest") return b.amount - a.amount || byDate(a, b);
    if (sort === "lowest") return a.amount - b.amount || byDate(a, b);
    return byDate(a, b);
  });
}
