import { ProjectStatus } from "@/types/project"; // or wherever it's defined

export function parseAnchorStatus(status: any): ProjectStatus {
  if ('open' in status) return ProjectStatus.Open;
  if ('inProgress' in status) return ProjectStatus.InProgress;
  if ('completed' in status) return ProjectStatus.Completed;
  if ('cancelled' in status) return ProjectStatus.Cancelled;
  return ProjectStatus.Open; // default/fallback
}
