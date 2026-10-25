import type { Item } from "./model";

type DraftStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const PREFIX = "xperiments:unsaved-record:v1";

function browserStore(): DraftStore | null {
  try { return typeof window === "undefined" ? null : window.localStorage; }
  catch { return null; }
}

/** Separate drafts by account, workspace, project, record type and metric category. */
export function recordDraftKey(record: Item, userId?: string | null): string {
  const segment = (value: string | null | undefined) => encodeURIComponent(value || "_");
  const subtype = record.kind === "goal"
    ? String(record.fields.goi_section || "objectives")
    : "default";
  return [PREFIX, segment(userId || "demo"), segment(record.workspace_id),
    segment(record.project_id), segment(record.kind), segment(subtype)].join(":");
}

export function saveRecordDraft(record: Item, userId?: string | null, storage: DraftStore | null = browserStore()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(recordDraftKey(record, userId), JSON.stringify({
      title: record.title, fields: record.fields, owner_id: record.owner_id,
      parent_id: record.parent_id, related_id: record.related_id,
    }));
    return true;
  } catch { return false; }
}

/** Restore editable fields only, retaining a newly generated ID for the record. */
export function restoreRecordDraft(fresh: Item, userId?: string | null, storage: DraftStore | null = browserStore()): Item | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(recordDraftKey(fresh, userId));
    if (!raw) return null;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return null;
    const value = saved as Record<string, unknown>;
    if (typeof value.title !== "string" || !value.fields ||
      typeof value.fields !== "object" || Array.isArray(value.fields)) return null;
    const fields = Object.fromEntries(
      Object.entries(value.fields).filter(([, v]) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    );
    const nullable = (key: string, fallback: string | null) =>
      typeof value[key] === "string" ? value[key] as string : value[key] === null ? null : fallback;
    return { ...fresh, title: value.title, fields: { ...fresh.fields, ...fields },
      owner_id: nullable("owner_id", fresh.owner_id),
      parent_id: nullable("parent_id", fresh.parent_id),
      related_id: nullable("related_id", fresh.related_id) };
  } catch { return null; }
}

export function clearRecordDraft(record: Item, userId?: string | null, storage: DraftStore | null = browserStore()): void {
  try { storage?.removeItem(recordDraftKey(record, userId)); } catch {}
}
