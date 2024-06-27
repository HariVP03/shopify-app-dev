import { Session } from "@shopify/shopify-api";
import type { ShopifyPayload } from "../../shopify/types";
import { shopifyApi } from "@shopify/shopify-api";
export declare function startManualOAuth(shopifyProvider: ReturnType<typeof shopifyApi>, shopifyPayload: ShopifyPayload, redirectUrl: string): string;
export declare function getSession(payload: ShopifyPayload): Promise<Session | null>;
export declare function createSessionIfNotExists(shopifyProvider: ReturnType<typeof shopifyApi>, payload: ShopifyPayload): Promise<Session>;
export declare function exchangeTokenForSession(shopifyProvider: ReturnType<typeof shopifyApi>, payload: ShopifyPayload): Promise<Session>;
