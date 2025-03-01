import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // TODO: below code was used for Prisma, but now we want to update using NestJS API
  // if (session) {
  //   await db.session.deleteMany({ where: { shop } });
  // }

  return new Response();
};
