import { describe, expect, it } from "vitest";
import {
  CODEX_DEFAULT_CONTEXT_WINDOW,
  getModelContextWindow,
} from "../src/app-types.js";

describe("getModelContextWindow", () => {
  it("returns undefined for unknown model", () => {
    expect(getModelContextWindow("unknown-model")).toBeUndefined();
  });

  it("returns undefined for Claude models (SDK provides at runtime)", () => {
    expect(getModelContextWindow("claude-opus-4-6-20260101")).toBeUndefined();
    expect(getModelContextWindow("claude-sonnet-4-20250514")).toBeUndefined();
    expect(getModelContextWindow("claude-3-5-sonnet-20241022")).toBeUndefined();
    expect(getModelContextWindow("claude-haiku-4-5-20251001")).toBeUndefined();
  });

  it("uses codex fallback when provider is codex and model is missing", () => {
    expect(getModelContextWindow(undefined, "codex")).toBe(
      CODEX_DEFAULT_CONTEXT_WINDOW,
    );
  });

  it("detects codex and gpt-5 models as 258K", () => {
    expect(getModelContextWindow("codex-5.3")).toBe(
      CODEX_DEFAULT_CONTEXT_WINDOW,
    );
    expect(getModelContextWindow("gpt-5-codex")).toBe(
      CODEX_DEFAULT_CONTEXT_WINDOW,
    );
    expect(getModelContextWindow("openai/gpt-5")).toBe(
      CODEX_DEFAULT_CONTEXT_WINDOW,
    );
  });

  it("returns undefined when provider is non-codex and model is missing", () => {
    expect(getModelContextWindow(undefined, "codex-oss")).toBeUndefined();
    expect(getModelContextWindow(undefined)).toBeUndefined();
  });

  it("detects Gemini models as 1M", () => {
    expect(getModelContextWindow("gemini-2.0-flash-exp")).toBe(1_000_000);
  });

  it("detects GPT-4 models as 128K", () => {
    expect(getModelContextWindow("gpt-4o-2024-08-06")).toBe(128_000);
    expect(getModelContextWindow("gpt-4-turbo")).toBe(128_000);
  });
});
