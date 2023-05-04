"use strict";
(() => {
var exports = {};
exports.id = 748;
exports.ids = [748];
exports.modules = {

/***/ 639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ auth)
});

;// CONCATENATED MODULE: external "next-auth"
const external_next_auth_namespaceObject = require("next-auth");
var external_next_auth_default = /*#__PURE__*/__webpack_require__.n(external_next_auth_namespaceObject);
;// CONCATENATED MODULE: external "next-auth/providers/credentials"
const credentials_namespaceObject = require("next-auth/providers/credentials");
var credentials_default = /*#__PURE__*/__webpack_require__.n(credentials_namespaceObject);
;// CONCATENATED MODULE: external "next-auth/react"
const react_namespaceObject = require("next-auth/react");
;// CONCATENATED MODULE: external "siwe"
const external_siwe_namespaceObject = require("siwe");
;// CONCATENATED MODULE: ./src/pages/api/auth/[...nextauth].js




// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
async function auth(req, res) {
    const providers = [
        credentials_default()({
            name: "Ethereum",
            credentials: {
                message: {
                    label: "Message",
                    type: "text",
                    placeholder: "0x0"
                },
                signature: {
                    label: "Signature",
                    type: "text",
                    placeholder: "0x0"
                }
            },
            async authorize (credentials) {
                try {
                    const siwe = new external_siwe_namespaceObject.SiweMessage(JSON.parse(credentials?.message || "{}"));
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
                    const result = await siwe.verify({
                        signature: credentials?.signature || "",
                        domain: nextAuthUrl.host,
                        nonce: await (0,react_namespaceObject.getCsrfToken)({
                            req
                        })
                    });
                    if (result.success) {
                        return {
                            id: siwe.address
                        };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            }
        }), 
    ];
    const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin");
    // Hide Sign-In with Ethereum from default sign page
    if (isDefaultSigninPage) {
        providers.pop();
    }
    return await external_next_auth_default()(req, res, {
        // https://next-auth.js.org/configuration/providers/oauth
        providers,
        session: {
            strategy: "jwt"
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            async session ({ session , token  }) {
                session.address = token.sub;
                session.user.name = token.sub;
                session.user.image = "https://www.fillmurray.com/128/128";
                return session;
            }
        }
    });
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(639));
module.exports = __webpack_exports__;

})();