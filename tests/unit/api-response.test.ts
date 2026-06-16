import { describe, it, expect } from "vitest";
import { apiError, apiSuccess } from "@/lib/api/response";

describe("API response helpers", () => {
  it("creates success response", async () => {
    const response = apiSuccess({ id: "1" });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe("1");
  });

  it("creates error response", async () => {
    const response = apiError("Not found", 404, "NOT_FOUND");
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
