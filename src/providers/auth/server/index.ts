import "server-only";
import {
  createSessionIfNotExists,
  getSession,
  startManualOAuth,
} from "./utils";
import { AuthActionResponse } from "../types";
import { ShopifyPayload } from "../../shopify/types";
import { shopifyApi } from "@shopify/shopify-api";

export const authProviderServer = {
  login: async function (
    shopifyProvider: ReturnType<typeof shopifyApi>,
    payload: ShopifyPayload,
    options: {
      manualOAuthRedirect: string;
    },
  ): Promise<AuthActionResponse> {
    const isTokenExchangePossible = !!payload.id_token;

    if (!isTokenExchangePossible) {
      return {
        success: true,
        redirectTo: startManualOAuth(
          shopifyProvider,
          payload,
          options.manualOAuthRedirect,
        ),
      };
    }

    const session = await createSessionIfNotExists(shopifyProvider, payload);

    if (!session || !session.id) {
      return {
        success: false,
        redirectTo: "/",
      };
    }

    return {
      success: true,
      redirectTo: "/home",
    };
  },

  getSession: async function (payload: ShopifyPayload) {
    const session = await getSession(payload);

    return session;
  },
};
