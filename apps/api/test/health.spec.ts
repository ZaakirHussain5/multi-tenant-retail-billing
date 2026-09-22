import { describe, expect, it } from "vitest";

import { HealthController } from "../src/modules/health/health.controller.js";

describe("HealthController", () => {
  it("returns an operational response", () => {
    const response = new HealthController().check();

    expect(response.service).toBe("retail-api");
    expect(response.status).toBe("ok");
    expect(Date.parse(response.timestamp)).not.toBeNaN();
  });
});
