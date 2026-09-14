import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { writeRecord } from "../src/records.js";

test("onboarding and all tabs render in both languages and themes with saved records", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    const { default: App } = await server.ssrLoadModule("/src/App.jsx");
    const year = new Date().getFullYear();
    let data = writeRecord({}, "expense", { id: 1, label: "Lunch", amount: 12.5, category: "Food", date: year + "-01-01" });
    data = writeRecord(data, "earning", { id: 2, label: "Salary", amount: 1000, category: "Salary", date: year + "-01-02" });
    const useStorage = values => Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { getItem: key => key.slice(8) in values ? JSON.stringify(values[key.slice(8)]) : null },
    });
    for (const lang of ["en", "zh"]) {
      for (const mode of ["dark", "light"]) {
        for (const activeTab of ["budget", "breakdown", "goals", "records"]) {
          useStorage({ lang, mode, activeTab, recordsSubTab: "expense", onboarded: true, balance: "1000", yearData: data });
          const html = renderToStaticMarkup(React.createElement(App));
          assert.ok(html.includes("Lunch"), [lang, mode, activeTab].join("/"));
          assert.ok(html.includes(lang === "zh" ? "记一笔" : "Add a record"));
          assert.match(html, /inputmode="decimal"/i);
          assert.ok(html.includes("12.50"));
        }
      }
    }
    useStorage({});
    assert.ok(renderToStaticMarkup(React.createElement(App)).includes("Welcome to Sakuhin"));
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else delete globalThis.localStorage;
    await server.close();
  }
});
