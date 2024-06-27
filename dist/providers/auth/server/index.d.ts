import "server-only";
import { AuthActionResponse } from "../types";
import { ShopifyPayload } from "../../shopify/types";
import { shopifyApi } from "@shopify/shopify-api";
export declare const authProviderServer: {
    login: (shopifyProvider: ReturnType<typeof shopifyApi>, payload: ShopifyPayload, options: {
        manualOAuthRedirect: string;
    }) => Promise<AuthActionResponse>;
    getSession: (payload: ShopifyPayload) => Promise<import("@shopify/shopify-api").Session | null>;
};
