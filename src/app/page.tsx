import Image from "next/image";
import { DrupalNode } from "next-drupal/src/types";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import {cookies} from "next/headers";
import { drupal } from "../lib/drupal";
import { NodeArticleTeaser } from "@/components/node--article--teaser";


type IndexPageProps = {
  nodes: DrupalNode[];
};

export default async function Page() {
  const nodes = await drupal.getResourceCollectionFromContext<DrupalNode[]>(
    "node--article",
    {locale: ''},
    {
      params: {
        "filter[status]": 1,
        "fields[node--article]": "title,path,field_image,uid,created",
        include: "field_image,uid",
        sort: "-created",
      },
    }
  );
    const cookiez = await cookies();
    const response = await fetch(`${process.env.AUTH0_BASE_URL}/api/auth/me`, {
        headers: { Cookie: cookiez.toString() },
    });
    const user: UserProfile = await response.json();
  return (
    <>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-sans">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <Image
            className="dark:invert"
            src={String(user.picture ?? '/next.svg')}
            alt={String(user.nickname ?? '')}
            width={100}
            height={100}
            priority
          />
          <p>Hello, {String(user.nickname ?? '')}!</p>
          <div className="container mx-auto">
            <h1 className="mb-10 text-6xl font-black">Latest Articles.</h1>
            {nodes?.length ? (
              nodes.map((node) => (
                <div key={node.id}>
                  <NodeArticleTeaser node={node} />
                  <hr className="my-20" />
                </div>
              ))
            ) : (
              <p className="py-4">No nodes found</p>
            )}
          </div>
        </main>
     </div>
    </>
  );
};