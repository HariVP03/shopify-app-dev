"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startManualOAuth = startManualOAuth;
exports.getSession = getSession;
exports.createSessionIfNotExists = createSessionIfNotExists;
exports.exchangeTokenForSession = exchangeTokenForSession;
const kv_1 = require("@vercel/kv");
const shopify_api_1 = require("@shopify/shopify-api");
function startManualOAuth(shopifyProvider, shopifyPayload, redirectUrl) {
    return `https://${shopifyPayload.shop}/admin/oauth/authorize?client_id=${shopifyProvider.config.apiKey}&scope=${shopifyProvider.config.scopes.toString()}&redirect_uri=${redirectUrl}&state=${121212}`;
}
function getSession(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const kvKey = payload.id_token;
        const session = (yield kv_1.kv.get(kvKey));
        return session;
    });
}
function createSessionIfNotExists(shopifyProvider, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const kvKey = payload.id_token;
        const session = yield getSession(payload);
        if (session)
            return session;
        const createdSession = yield exchangeTokenForSession(shopifyProvider, payload);
        yield kv_1.kv.set(kvKey, createdSession, { ex: 60 * 60, nx: true });
        return createdSession;
    });
}
function exchangeTokenForSession(shopifyProvider, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const shop = shopifyProvider.utils.sanitizeShop(payload.shop, true);
        const sessionToken = payload.id_token;
        const { session } = yield shopifyProvider.auth.tokenExchange({
            sessionToken,
            shop,
            requestedTokenType: shopify_api_1.RequestedTokenType.OfflineAccessToken,
        });
        yield kv_1.kv.set(sessionToken, session, { ex: 60 * 60, nx: true });
        return session;
    });
}
