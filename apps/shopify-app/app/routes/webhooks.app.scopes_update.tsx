import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const current = payload.current as string[];
  if (session) {
    // TODO: below code was used for Prisma, but now we want to update using NestJS API
    // await db.session.update({
    //   where: {
    //     id: session.id,
    //   },
    //   data: {
    //     scope: current.toString(),
    //   },
    // });
  }
  return new Response();
};
