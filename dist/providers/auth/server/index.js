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
exports.authProviderServer = void 0;
require("server-only");
const utils_1 = require("./utils");
exports.authProviderServer = {
    login: function (shopifyProvider, payload, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const isTokenExchangePossible = !!payload.id_token;
            if (!isTokenExchangePossible) {
                return {
                    success: true,
                    redirectTo: (0, utils_1.startManualOAuth)(shopifyProvider, payload, options.manualOAuthRedirect),
                };
            }
            const session = yield (0, utils_1.createSessionIfNotExists)(shopifyProvider, payload);
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
        });
    },
    getSession: function (payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield (0, utils_1.getSession)(payload);
            return session;
        });
    },
};
