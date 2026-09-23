// src/providers/access-control.ts
import type { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./auth";

// Define what each role can do, per resource + action
const rolePermissions: Record<string, { resource: string; action: string }[]> =
  {
    student: [{ resource: "classes", action: "list" }],
    teacher: [
      { resource: "dashboard", action: "list" },
      { resource: "subjects", action: "list" },
      { resource: "subjects", action: "create" },
      { resource: "classes", action: "list" },
      { resource: "classes", action: "create" },
      { resource: "classes", action: "edit" },
      { resource: "classes", action: "delete" },
    ],
    admin: [
      { resource: "dashboard", action: "list" },
      { resource: "subjects", action: "list" },
      { resource: "subjects", action: "create" },
      { resource: "classes", action: "list" },
      { resource: "classes", action: "create" },
      { resource: "classes", action: "edit" },
      { resource: "classes", action: "delete" },
    ],
  };

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const permissions = await authProvider.getPermissions?.();
    const role = (permissions as { role?: string } | null)?.role;

    if (!role) return { can: false };

    const allowed = rolePermissions[role] ?? [];
    const can = allowed.some(
      (p) => p.resource === resource && p.action === action,
    );

    return {
      can,
      reason: can ? undefined : "Unauthorized",
    };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true, // 👈 hides menu links / action buttons instead of just disabling them
    },
  },
};
