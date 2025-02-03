// ../../app/[...slug]/page.tsx
import Head from "next/head";
import { notFound } from "next/navigation";
import { DrupalNode } from "next-drupal";

import { drupal } from "../../lib/drupal";
import { NodeArticle } from "../../components/node--article";
import { NodeBasicPage } from "../../components/node--basic-page";
import { Layout } from "../../components/layout";
import { buildContext } from "../../lib/buildContext";

const RESOURCE_TYPES = ["node--page", "node--article"];

// Optional: Enable ISR with revalidation (in seconds)
export const revalidate = 60;

/**
 * Define the type expected for static params for a catch-all route.
 * Next.js expects an object with a property 'slug' as an array of strings.
 */
interface StaticPath {
  slug: string[];
  locale?: string;
}

/**
 * generateStaticParams replaces getStaticPaths.
 * The Drupal helper may return a union type (string or object), so we map over them to always return a StaticPath.
 */
export async function generateStaticParams() {
  const defaultContext = {
    params: {},
    query: {},
    preview: false,
    locale: undefined,
    defaultLocale: "en",
  };

  // The Drupal helper returns a union type.
  const paths = (await drupal.getStaticPathsFromContext(
    RESOURCE_TYPES,
    defaultContext
  )) as (string | { params: { slug: string[] }; locale?: string })[];

  return paths.map((p): StaticPath => {
    if (typeof p === "string") {
      return { slug: p.split("/"), locale: undefined };
    } else {
      return { slug: p.params.slug, locale: p.locale };
    }
  });
}

// Main Server Component (replacing getStaticProps)
export default async function NodePage(
  props: {
    params: { slug: string | string[]; locale?: string };
    searchParams: { [key: string]: string | string[] | undefined };
  }
) {
  // Await the dynamic route properties explicitly
  const params = await Promise.resolve(props.params);
  const searchParams = await Promise.resolve(props.searchParams);

  // Now build the legacy-style context using our helper.
  const context = await buildContext({ params, searchParams });

  // Translate the slug into a Drupal path using your legacy helper.
  console.log(context);
  let slugArray = params.slug;
  const nonTranslatedPath = Array.isArray(slugArray) ? slugArray.join('/') : '';
  console.log(nonTranslatedPath);
  const path = await drupal.translatePath(nonTranslatedPath);
  if (!path) {
    notFound();
  }

  const type = path.jsonapi.resourceName;
  let fetchParams = {};
  if (type === "node--article") {
    fetchParams = { include: "field_image,uid" };
  }

  // Fetch the Drupal resource using your legacy helper.
  const resource = await drupal.getResourceFromContext<DrupalNode>(
    path,
    context,
    { params: fetchParams }
  );

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`);
  }

  // If not in preview mode and the resource is unpublished, render a 404 page.
  if (!context.preview && resource?.status === false) {
    notFound();
  }

  return (
    <Layout>
      <Head>
        <title>{resource.title}</title>
        <meta name="description" content="A Next.js site powered by Drupal." />
      </Head>
      {resource.type === "node--page" && <NodeBasicPage node={resource} />}
      {resource.type === "node--article" && <NodeArticle node={resource} />}
    </Layout>
  );
}
