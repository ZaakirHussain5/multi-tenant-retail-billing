import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check(): { service: string; status: "ok"; timestamp: string } {
    return {
      service: "retail-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
