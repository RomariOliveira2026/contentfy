/** Shared authorization helpers — keep admin gates consistent. */

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}

export function canAccessOwnedResource(input: {
  actorUserId: number;
  actorRole: string;
  ownerUserId: number;
}): boolean {
  return (
    isAdminRole(input.actorRole) || input.actorUserId === input.ownerUserId
  );
}
