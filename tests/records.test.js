import test from "node:test";
import assert from "node:assert/strict";
import { localDateString, parseAmount, dateParts, validateRecord, writeRecord, removeRecord, recordsForPeriod, filterRecords } from "../src/records.js";

const sample = (id, date, amount = 12.5, label = "Lunch", category = "Food") => ({ id, date, amount, label, category });
const total = data => Object.values(data).flatMap(year => Object.values(year)).reduce((sum, month) =>
  sum + month.earnings.reduce((s, item) => s + item.amount, 0) - month.expenses.reduce((s, item) => s + item.amount, 0), 0);

test("currency accepts cents without silently accepting invalid or negative amounts", () => {
  for (const [value, amount] of [["12.50", 12.5], [" .50 ", 0.5], ["1.", 1], ["0.01", 0.01], ["100", 100]]) assert.equal(parseAmount(value), amount);
  for (const value of ["", " ", "0", "-1", "1.234", "Infinity", "NaN", "12abc", "1e3", "1,000", "9007199254740991", null]) assert.equal(parseAmount(value), null, String(value));
});

test("calendar validation rejects impossible, blank and future dates", () => {
  const draft = { amount: "12.50", category: "Food", date: "2024-02-29" };
  assert.deepEqual(dateParts(draft.date), { year: 2024, month: 1 });
  for (const date of ["", "2025-02-29", "2026-02-30", "2026-13-01", "2026-00-10", "invalid", "2026-9-1"]) assert.equal(dateParts(date), null);
  assert.equal(validateRecord({ ...draft, date: "2026-09-15" }, "2026-09-14").error, "invalidDate");
  assert.equal(validateRecord({ ...draft, amount: "-1" }).field, "amount");
  assert.equal(validateRecord({ ...draft, category: "" }).field, "category");
  assert.deepEqual(validateRecord(draft, "2026-09-14"), { amount: 12.5, year: 2024, month: 1 });
});

test("late-night and early-morning entries use the local calendar date", () => {
  assert.equal(localDateString(new Date(2026, 0, 1, 0, 15)), "2026-01-01");
  assert.equal(localDateString(new Date(2026, 11, 31, 23, 45)), "2026-12-31");
});

test("adding a record creates its year without changing previous data", () => {
  const before = writeRecord({}, "earning", sample(1, "2025-12-31", 200));
  const snapshot = JSON.stringify(before);
  const after = writeRecord(before, "expense", sample(2, "2026-01-01", 25));
  assert.equal(total(after), 175);
  assert.equal(Object.keys(after[2026]).length, 12);
  assert.equal(after[2026][0].expenses.length, 1);
  assert.equal(JSON.stringify(before), snapshot);
});

test("editing across years moves exactly one record and preserves metadata", () => {
  let before = writeRecord({}, "expense", { ...sample(7, "2025-12-31", 20), note: "legacy metadata" });
  before = writeRecord(before, "expense", sample(7, "2024-06-01", 30));
  const snapshot = JSON.stringify(before);
  const original = recordsForPeriod(before, 2025, "all", "expense")[0];
  const after = writeRecord(before, "expense", { ...original, date: "2026-01-01", amount: 25 }, original);
  assert.equal(after[2025][11].expenses.length, 0);
  assert.equal(after[2026][0].expenses.length, 1);
  assert.equal(after[2024][5].expenses[0].amount, 30);
  assert.equal(after[2026][0].expenses[0].id, 7);
  assert.equal(after[2026][0].expenses[0].note, "legacy metadata");
  assert.equal("sourceYear" in after[2026][0].expenses[0], false);
  assert.equal(total(after), -55);
  assert.equal(JSON.stringify(before), snapshot);
});

test("editing within one month replaces rather than duplicates a record", () => {
  const before = writeRecord({}, "earning", sample(1, "2026-03-10", 100));
  const original = recordsForPeriod(before, 2026, 2, "earning")[0];
  const after = writeRecord(before, "earning", { ...original, label: "Corrected", amount: 150 }, original);
  assert.equal(after[2026][2].earnings.length, 1);
  assert.equal(after[2026][2].earnings[0].label, "Corrected");
  assert.equal(total(after), 150);
  assert.equal(total(before), 100); // The undo snapshot remains usable.
});

test("deleting uses the source month and year, even for repeated legacy IDs", () => {
  let before = writeRecord({}, "expense", sample(1, "2025-12-31", 20));
  before = writeRecord(before, "expense", sample(1, "2026-01-01", 30));
  const record = recordsForPeriod(before, 2025, "all", "expense")[0];
  const after = removeRecord(before, "expense", record);
  assert.equal(recordsForPeriod(after, 2025, "all", "expense").length, 0);
  assert.equal(recordsForPeriod(after, 2026, "all", "expense").length, 1);
  assert.equal(total(before), -50);
  assert.equal(total(after), -30);
});

test("period selection sorts dates and supports legacy partial years", () => {
  const data = { 2026: { 0: { earnings: [], expenses: [sample(1, "2026-01-01"), sample(2, "2026-01-03")] } } };
  assert.deepEqual(recordsForPeriod(data, 2026, "all", "expense").map(record => record.id), [2, 1]);
  assert.equal(recordsForPeriod(data, 2026, 1, "expense").length, 0);
  assert.equal(recordsForPeriod(data, 2025, "all", "expense").length, 0);
});

test("search combines localized category, label, date, amount and category filters", () => {
  const rows = [sample(1, "2026-09-01", 12.5, "Coffee", "Food"), sample(2, "2026-09-02", 30, "Bus", "Transport"), sample(3, "2026-09-03", 8, "Lunch", "Food")];
  const categoryNames = { Food: "餐饮", Transport: "交通" };
  assert.deepEqual(filterRecords(rows, { query: "  COFFEE 12.5 ", categoryNames }).map(record => record.id), [1]);
  assert.deepEqual(filterRecords(rows, { query: "餐饮 2026-09", categoryNames }).map(record => record.id), [3, 1]);
  assert.equal(filterRecords(rows, { query: "coffee", category: "Transport" }).length, 0);
  assert.deepEqual(filterRecords(rows, { category: "Food", sort: "highest" }).map(record => record.id), [1, 3]);
  assert.deepEqual(filterRecords(rows, { sort: "lowest" }).map(record => record.id), [3, 1, 2]);
  assert.deepEqual(filterRecords(rows, { sort: "oldest" }).map(record => record.id), [1, 2, 3]);
  assert.deepEqual(rows.map(record => record.id), [1, 2, 3]);
});

test("invalid record dates and types cannot write into an unintended bucket", () => {
  assert.throws(() => writeRecord({}, "expense", sample(1, "2026-02-30")));
  assert.throws(() => writeRecord({}, "other", sample(1, "2026-01-01")));
});

test("a colliding destination ID is rejected instead of creating ambiguous records", () => {
  const before = writeRecord({}, "expense", sample(1, "2026-01-01"));
  assert.throws(() => writeRecord(before, "expense", sample(1, "2026-01-02")));
  assert.equal(before[2026][0].expenses.length, 1);
});
