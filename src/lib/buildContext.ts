// ../../lib/buildContext.ts
import { headers } from "next/headers";

export interface LegacyContext {
  params: { [key: string]: string | string[] };
  query: { [key: string]: string | string[] | undefined };
  preview: boolean;
  locale?: string;
  defaultLocale?: string;
}

/**
 * getPreview checks for a preview header.
 * Adjust this logic if your project uses a different mechanism for preview mode.
 */
async function getPreview(): Promise<boolean> {
  const hdrs = await headers();
  return !!hdrs.get("x-next-preview-data");
}

/**
 * buildContext - Reconstructs a legacy-style context object.
 */
export async function buildContext({
  params,
  searchParams,
}: {
  params: { [key: string]: string | string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<LegacyContext> {
  const preview = await getPreview();
  const locale = typeof params.locale === "string" ? params.locale : '';
  const defaultLocale = ""; // Change this to match your default locale if needed

  return {
    params,
    query: searchParams,
    preview,
    locale,
    defaultLocale,
  };
}
