export const adminMediaFolders = ["articles", "actualites", "realisations", "accueil", "bureau", "expertises", "logo"] as const;

export type AdminMediaFolder = (typeof adminMediaFolders)[number];

export function isAdminMediaFolder(value: FormDataEntryValue | null): value is AdminMediaFolder {
  return typeof value === "string" && adminMediaFolders.some((folder) => folder === value);
}
