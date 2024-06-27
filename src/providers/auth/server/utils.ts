import { kv } from "@vercel/kv";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import type { ShopifyPayload } from "../../shopify/types";
import { shopifyApi } from "@shopify/shopify-api";

export function startManualOAuth(
  shopifyProvider: ReturnType<typeof shopifyApi>,
  shopifyPayload: ShopifyPayload,
  redirectUrl: string,
) {
  return `https://${shopifyPayload.shop}/admin/oauth/authorize?client_id=${shopifyProvider.config.apiKey}&scope=${shopifyProvider.config.scopes.toString()}&redirect_uri=${redirectUrl}&state=${121212}`;
}

export async function getSession(payload: ShopifyPayload) {
  const kvKey = payload.id_token;

  const session = (await kv.get(kvKey)) as Session | null;

  return session;
}

export async function createSessionIfNotExists(
  shopifyProvider: ReturnType<typeof shopifyApi>,
  payload: ShopifyPayload,
) {
  const kvKey = payload.id_token;

  const session = await getSession(payload);

  if (session) return session;

  const createdSession = await exchangeTokenForSession(
    shopifyProvider,
    payload,
  );

  await kv.set(kvKey, createdSession, { ex: 60 * 60, nx: true });

  return createdSession;
}

export async function exchangeTokenForSession(
  shopifyProvider: ReturnType<typeof shopifyApi>,
  payload: ShopifyPayload,
) {
  const shop = shopifyProvider.utils.sanitizeShop(payload.shop, true) as string;

  const sessionToken = payload.id_token;

  const { session } = await shopifyProvider.auth.tokenExchange({
    sessionToken,
    shop,
    requestedTokenType: RequestedTokenType.OfflineAccessToken,
  });

  await kv.set(sessionToken, session, { ex: 60 * 60, nx: true });

  return session;
}
