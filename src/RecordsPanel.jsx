import { useEffect, useMemo, useRef, useState } from "react";
import { filterRecords, localDateString, validateRecord } from "./records.js";
import { RECORDS_COPY } from "./records-copy.js";
import "./records.css";

const emptyDraft = () => ({ amount: "", label: "", category: "", date: localDateString() });
const formatMoney = amount => amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function RecordsPanel({
  lang, t, active, kind, onTypeChange, records, categories, categoryNames, categoryEmojis,
  periodLabel, focusRequest, onSave, onRemove,
}) {
  const copy = RECORDS_COPY[lang];
  const [drafts, setDrafts] = useState(() => ({ earning: emptyDraft(), expense: emptyDraft() }));
  const [editing, setEditing] = useState({ earning: null, expense: null });
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const amountRef = useRef(null);
  const dateRef = useRef(null);
  const categoryRef = useRef(null);
  const formRef = useRef(null);
  const original = editing[kind];
  const options = Array.from(new Set([...categories[kind], ...(original ? [original.category || "Other"] : [])]));
  const storedDraft = drafts[kind];
  const draft = { ...storedDraft, category: options.includes(storedDraft.category) ? storedDraft.category : options[0] || "" };
  const names = categoryNames[kind];
  const rows = records[kind];
  const filterCategories = Array.from(new Set([...categories[kind], ...rows.map(record => record.category || "Other")]));
  const visible = useMemo(() => filterRecords(rows, { query, category, sort, categoryNames: names }), [rows, query, category, sort, names]);
  const total = visible.reduce((sum, record) => sum + record.amount, 0);
  const error = errors[kind];
  const today = localDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const sign = kind === "earning" ? "+" : "−";

  const focusAmount = () => {
    amountRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  };
  useEffect(() => {
    if (active && focusRequest > 0) focusAmount();
  }, [active, focusRequest]);

  const changeDraft = (field, value) => {
    setDrafts(prev => ({ ...prev, [kind]: { ...draft, [field]: value } }));
    setErrors(prev => ({ ...prev, [kind]: null }));
  };
  const clearFilters = () => { setQuery(""); setCategory(""); };
  const switchType = next => { onTypeChange(next); clearFilters(); };
  const submit = event => {
    event.preventDefault();
    const validation = validateRecord(draft);
    if (validation.error) {
      setErrors(prev => ({ ...prev, [kind]: validation }));
      ({ amount: amountRef, date: dateRef, category: categoryRef }[validation.field]).current?.focus();
      return;
    }
    const result = onSave(kind, draft, original);
    if (!result?.ok) {
      setErrors(prev => ({ ...prev, [kind]: { error: result?.error || "saveFailed" } }));
      return;
    }
    setDrafts(prev => ({ ...prev, [kind]: { ...emptyDraft(), category: draft.category, date: draft.date } }));
    setEditing(prev => ({ ...prev, [kind]: null }));
    setErrors(prev => ({ ...prev, [kind]: null }));
    clearFilters();
    focusAmount();
  };
  const edit = record => {
    setEditing(prev => ({ ...prev, [kind]: record }));
    setDrafts(prev => ({ ...prev, [kind]: { amount: String(record.amount), label: record.label || "", date: record.date || today, category: record.category || "Other" } }));
    setErrors(prev => ({ ...prev, [kind]: null }));
    focusAmount();
  };
  const cancelEdit = () => {
    setEditing(prev => ({ ...prev, [kind]: null }));
    setDrafts(prev => ({ ...prev, [kind]: emptyDraft() }));
    setErrors(prev => ({ ...prev, [kind]: null }));
    focusAmount();
  };
  const remove = record => {
    if (onRemove(kind, record)?.ok && original?.id === record.id && original?.sourceYear === record.sourceYear && original?.sourceMonth === record.sourceMonth) cancelEdit();
  };

  return (
    <section className={"records-panel records-" + kind} aria-label={t.tabRecords}>
      <div className="records-types" aria-label={t.tabRecords}>
        {["expense", "earning"].map(type => (
          <button key={type} type="button" aria-pressed={kind === type} onClick={() => switchType(type)}
            className={kind === type ? "sub-tab sub-tab-active" : "sub-tab sub-tab-inactive"}>
            {type === "earning" ? "↗ " + t.earnings : "↘ " + t.expenses}
          </button>
        ))}
      </div>

      <form ref={formRef} className="record-form record-surface" onSubmit={submit} noValidate aria-labelledby="record-form-title">
        <div className="record-heading">
          <h2 id="record-form-title">{original ? copy.editRecord : copy.newRecord} · {kind === "earning" ? t.earnings : t.expenses}</h2>
          {original && <button type="button" className="record-button" onClick={cancelEdit}>{copy.cancel}</button>}
        </div>
        <p className="record-hint">{original ? original.date : copy.entryHint}</p>
        <div className="record-fields">
          <label className="record-field">
            <span>{copy.amount}</span>
            <input ref={amountRef} name="amount" type="text" inputMode="decimal" autoComplete="off" placeholder="0.00"
              required value={draft.amount} onChange={event => changeDraft("amount", event.target.value)}
              aria-invalid={error?.field === "amount"} aria-describedby={error ? "record-error" : undefined} />
          </label>
          <label className="record-field">
            <span>{copy.category}</span>
            <select ref={categoryRef} name="category" value={draft.category} onChange={event => changeDraft("category", event.target.value)}
              aria-invalid={error?.field === "category"} aria-describedby={error ? "record-error" : undefined}>
              {options.length === 0 && <option value="">{copy.invalidCategory}</option>}
              {options.map(name => <option key={name} value={name}>{categoryEmojis[kind][name] || ""} {names[name] || name}</option>)}
            </select>
          </label>
          <label className="record-field record-description">
            <span>{copy.label}</span>
            <input name="description" maxLength={200} value={draft.label} placeholder={copy.labelPlaceholder}
              onChange={event => changeDraft("label", event.target.value)} />
          </label>
          <div className="record-field record-date">
            <label htmlFor="record-date">{copy.date}</label>
            <input ref={dateRef} id="record-date" name="date" type="date" min="1000-01-01" max={today} required value={draft.date}
              onChange={event => changeDraft("date", event.target.value)}
              aria-invalid={error?.field === "date"} aria-describedby={error ? "record-error" : undefined} />
            <div className="record-date-shortcuts">
              <button type="button" onClick={() => changeDraft("date", today)}>{copy.today}</button>
              <button type="button" onClick={() => changeDraft("date", localDateString(yesterday))}>{copy.yesterday}</button>
            </div>
          </div>
          <button type="submit" className="record-button record-primary record-submit">{original ? copy.saveChanges : copy.save}</button>
        </div>
        {error && <p id="record-error" className="record-error" role="alert">{copy[error.error] || copy.saveFailed}</p>}
      </form>

      <div className="record-surface">
        <div className="record-heading">
          <h2>{kind === "earning" ? t.earnings : t.expenses}</h2>
          <span className="record-hint">{periodLabel}</span>
        </div>
        <div className="record-toolbar">
          <label className="record-field record-search">
            <span>{copy.search}</span>
            <input type="search" value={query} placeholder={copy.searchPlaceholder} aria-describedby="record-search-hint"
              onChange={event => setQuery(event.target.value)} />
          </label>
          <label className="record-field">
            <span>{copy.category}</span>
            <select value={category} onChange={event => setCategory(event.target.value)}>
              <option value="">{copy.allCategories}</option>
              {filterCategories.map(name => <option key={name} value={name}>{names[name] || name}</option>)}
            </select>
          </label>
          <label className="record-field">
            <span>{copy.sort}</span>
            <select value={sort} onChange={event => setSort(event.target.value)}>
              {["newest", "oldest", "highest", "lowest"].map(value => <option key={value} value={value}>{copy[value]}</option>)}
            </select>
          </label>
        </div>
        <p id="record-search-hint" className="record-hint">{copy.periodHint}</p>
        <div className="record-summary" role="status" aria-live="polite" aria-atomic="true">
          <span>{visible.length} {copy.of} {rows.length} {copy.results}</span>
          <strong>{copy.matchingTotal} · {sign}${formatMoney(total)}</strong>
          {(query || category) && <button type="button" className="record-button" onClick={clearFilters}>{copy.clear}</button>}
        </div>
        {visible.length === 0 ? (
          <div className="record-empty">
            <strong>{rows.length === 0 ? copy.empty : copy.noMatches}</strong>
            <p>{rows.length === 0 ? copy.emptyHint : copy.noMatchesHint}</p>
          </div>
        ) : (
          <div className="record-list">
            <table className="records-table" role="table">
              <caption className="record-sr-only">{kind === "earning" ? t.earnings : t.expenses} · {periodLabel}</caption>
              <thead role="rowgroup"><tr role="row">
                <th role="columnheader" scope="col">{copy.date}</th><th role="columnheader" scope="col">{t.label}</th><th role="columnheader" scope="col">{copy.category}</th>
                <th role="columnheader" scope="col">{copy.amount}</th><th role="columnheader" scope="col">{copy.actions}</th>
              </tr></thead>
              <tbody role="rowgroup">{visible.map(record => (
                <tr role="row" key={[record.sourceYear, record.sourceMonth, record.id].join("-")}>
                  <td role="cell" data-label={copy.date}>{record.date || "—"}</td>
                  <td role="cell" data-label={t.label}>{record.label}</td>
                  <td role="cell" data-label={copy.category}>{categoryEmojis[kind][record.category] || "📦"} {names[record.category] || record.category}</td>
                  <td role="cell" className="record-money" data-label={copy.amount}>{sign}${formatMoney(record.amount)}</td>
                  <td role="cell" className="record-actions">
                    <button type="button" className="record-button" onClick={() => edit(record)}
                      aria-label={copy.edit + ": " + record.label}>{copy.edit}</button>
                    <button type="button" className="record-button record-delete" onClick={() => remove(record)}
                      aria-label={copy.remove + ": " + record.label}>{copy.remove}</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
