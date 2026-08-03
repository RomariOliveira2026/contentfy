import { describe, expect, it } from "vitest";
import { canAccessOwnedResource, isAdminRole } from "./authz";

describe("admin authorization helpers", () => {
  it("recognizes admin role", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("user")).toBe(false);
    expect(isAdminRole("affiliate")).toBe(false);
  });

  it("allows owner or admin; denies other users", () => {
    expect(
      canAccessOwnedResource({
        actorUserId: 10,
        actorRole: "user",
        ownerUserId: 10,
      })
    ).toBe(true);

    expect(
      canAccessOwnedResource({
        actorUserId: 99,
        actorRole: "admin",
        ownerUserId: 10,
      })
    ).toBe(true);

    expect(
      canAccessOwnedResource({
        actorUserId: 11,
        actorRole: "user",
        ownerUserId: 10,
      })
    ).toBe(false);
  });
});
