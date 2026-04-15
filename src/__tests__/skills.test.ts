import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpenClawClient } from "../client";
import { installMockWebSocket, getMockWs, completeHandshake } from "./helpers/mock-ws";

describe("Skills helpers", () => {
  let client: OpenClawClient;

  beforeEach(async () => {
    installMockWebSocket();
    client = new OpenClawClient({
      url: "ws://localhost:18789",
      autoReconnect: false,
    });
    await completeHandshake(client);
  });

  afterEach(async () => {
    await client.disconnect();
    vi.restoreAllMocks();
  });

  it("skills.status sends skills.status method", async () => {
    const ws = getMockWs();
    const sentBefore = ws.sent.length;

    const statusPromise = client.skills.status();

    const sentMsg = JSON.parse(ws.sent[sentBefore]);
    expect(sentMsg.type).toBe("req");
    expect(sentMsg.method).toBe("skills.status");

    ws.simulateMessage({
      type: "res",
      id: sentMsg.id,
      ok: true,
      payload: {
        loaded: 5,
        failed: 1,
        skills: [
          { name: "skill-creator", status: "loaded" },
          { name: "pdf", status: "loaded" },
          { name: "xlsx", status: "failed", error: "Missing dependency" }
        ]
      },
    });

    const result = await statusPromise;
    expect(result).toEqual({
      loaded: 5,
      failed: 1,
      skills: [
        { name: "skill-creator", status: "loaded" },
        { name: "pdf", status: "loaded" },
        { name: "xlsx", status: "failed", error: "Missing dependency" }
      ]
    });
  });

  it("skills.status handles error response", async () => {
    const ws = getMockWs();
    const sentBefore = ws.sent.length;

    const statusPromise = client.skills.status();

    const sentMsg = JSON.parse(ws.sent[sentBefore]);

    ws.simulateMessage({
      type: "res",
      id: sentMsg.id,
      ok: false,
      error: {
        code: "METHOD_NOT_FOUND",
        message: "Method skills.status not available"
      },
    });

    await expect(statusPromise).rejects.toThrow("Method skills.status not available");
  });
  
});