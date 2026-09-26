import type { LocalizedText } from "@/lib/i18n";

export interface ProjectDetail {
  imageLabel: LocalizedText;
  description: LocalizedText;
  methods: LocalizedText[];
  results: { value: string; label: LocalizedText }[];
}

export const projectDetails: Record<string, ProjectDetail> = {};
