import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names and removes duplicates", () => {
    const result = cn("flex", false && "hidden", "flex", "items-center", undefined);
    expect(result).toBe("flex items-center");
  });

  it("handles conditional class objects", () => {
    const active = true;
    const result = cn("btn", { "btn-active": active, "btn-disabled": !active });
    expect(result).toBe("btn btn-active");
  });
});
