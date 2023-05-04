"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/credentials":
/*!**************************************************!*\
  !*** external "next-auth/providers/credentials" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("next-auth/react");

/***/ }),

/***/ "siwe":
/*!***********************!*\
  !*** external "siwe" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("siwe");

/***/ }),

/***/ "(api)/./src/pages/api/auth/[...nextauth].js":
/*!*********************************************!*\
  !*** ./src/pages/api/auth/[...nextauth].js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ auth)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"next-auth/providers/credentials\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! siwe */ \"siwe\");\n/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(siwe__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// For more information on each option (and a full list of options) go to\n// https://next-auth.js.org/configuration/options\nasync function auth(req, res) {\n    const providers = [\n        next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1___default()({\n            name: \"Ethereum\",\n            credentials: {\n                message: {\n                    label: \"Message\",\n                    type: \"text\",\n                    placeholder: \"0x0\"\n                },\n                signature: {\n                    label: \"Signature\",\n                    type: \"text\",\n                    placeholder: \"0x0\"\n                }\n            },\n            async authorize (credentials) {\n                try {\n                    const siwe = new siwe__WEBPACK_IMPORTED_MODULE_3__.SiweMessage(JSON.parse(credentials?.message || \"{}\"));\n                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);\n                    const result = await siwe.verify({\n                        signature: credentials?.signature || \"\",\n                        domain: nextAuthUrl.host,\n                        nonce: await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.getCsrfToken)({\n                            req\n                        })\n                    });\n                    if (result.success) {\n                        return {\n                            id: siwe.address\n                        };\n                    }\n                    return null;\n                } catch (e) {\n                    return null;\n                }\n            }\n        }), \n    ];\n    const isDefaultSigninPage = req.method === \"GET\" && req.query.nextauth.includes(\"signin\");\n    // Hide Sign-In with Ethereum from default sign page\n    if (isDefaultSigninPage) {\n        providers.pop();\n    }\n    return await next_auth__WEBPACK_IMPORTED_MODULE_0___default()(req, res, {\n        // https://next-auth.js.org/configuration/providers/oauth\n        providers,\n        session: {\n            strategy: \"jwt\"\n        },\n        secret: process.env.NEXTAUTH_SECRET,\n        callbacks: {\n            async session ({ session , token  }) {\n                session.address = token.sub;\n                session.user.name = token.sub;\n                session.user.image = \"https://www.fillmurray.com/128/128\";\n                return session;\n            }\n        }\n    });\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBZ0M7QUFDaUM7QUFDbkI7QUFDWjtBQUVsQyx5RUFBeUU7QUFDekUsaURBQWlEO0FBQ2xDLGVBQWVJLElBQUksQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDM0MsTUFBTUMsU0FBUyxHQUFHO1FBQ2hCTixzRUFBbUIsQ0FBQztZQUNsQk8sSUFBSSxFQUFFLFVBQVU7WUFDaEJDLFdBQVcsRUFBRTtnQkFDWEMsT0FBTyxFQUFFO29CQUNQQyxLQUFLLEVBQUUsU0FBUztvQkFDaEJDLElBQUksRUFBRSxNQUFNO29CQUNaQyxXQUFXLEVBQUUsS0FBSztpQkFDbkI7Z0JBQ0RDLFNBQVMsRUFBRTtvQkFDVEgsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCQyxJQUFJLEVBQUUsTUFBTTtvQkFDWkMsV0FBVyxFQUFFLEtBQUs7aUJBQ25CO2FBQ0Y7WUFDRCxNQUFNRSxTQUFTLEVBQUNOLFdBQVcsRUFBRTtnQkFDM0IsSUFBSTtvQkFDRixNQUFNTyxJQUFJLEdBQUcsSUFBSWIsNkNBQVcsQ0FBQ2MsSUFBSSxDQUFDQyxLQUFLLENBQUNULFdBQVcsRUFBRUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDO29CQUN0RSxNQUFNUyxXQUFXLEdBQUcsSUFBSUMsR0FBRyxDQUFDQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsWUFBWSxDQUFDO29CQUVyRCxNQUFNQyxNQUFNLEdBQUcsTUFBTVIsSUFBSSxDQUFDUyxNQUFNLENBQUM7d0JBQy9CWCxTQUFTLEVBQUVMLFdBQVcsRUFBRUssU0FBUyxJQUFJLEVBQUU7d0JBQ3ZDWSxNQUFNLEVBQUVQLFdBQVcsQ0FBQ1EsSUFBSTt3QkFDeEJDLEtBQUssRUFBRSxNQUFNMUIsNkRBQVksQ0FBQzs0QkFBRUcsR0FBRzt5QkFBRSxDQUFDO3FCQUNuQyxDQUFDO29CQUVGLElBQUltQixNQUFNLENBQUNLLE9BQU8sRUFBRTt3QkFDbEIsT0FBTzs0QkFDTEMsRUFBRSxFQUFFZCxJQUFJLENBQUNlLE9BQU87eUJBQ2pCO29CQUNILENBQUM7b0JBQ0QsT0FBTyxJQUFJO2dCQUNiLEVBQUUsT0FBT0MsQ0FBQyxFQUFFO29CQUNWLE9BQU8sSUFBSTtnQkFDYixDQUFDO1lBQ0gsQ0FBQztTQUNGLENBQUM7S0FDSDtJQUVELE1BQU1DLG1CQUFtQixHQUN2QjVCLEdBQUcsQ0FBQzZCLE1BQU0sS0FBSyxLQUFLLElBQUk3QixHQUFHLENBQUM4QixLQUFLLENBQUNDLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUUvRCxvREFBb0Q7SUFDcEQsSUFBSUosbUJBQW1CLEVBQUU7UUFDdkIxQixTQUFTLENBQUMrQixHQUFHLEVBQUU7SUFDakIsQ0FBQztJQUVELE9BQU8sTUFBTXRDLGdEQUFRLENBQUNLLEdBQUcsRUFBRUMsR0FBRyxFQUFFO1FBQzlCLHlEQUF5RDtRQUN6REMsU0FBUztRQUNUZ0MsT0FBTyxFQUFFO1lBQ1BDLFFBQVEsRUFBRSxLQUFLO1NBQ2hCO1FBQ0RDLE1BQU0sRUFBRXBCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDb0IsZUFBZTtRQUNuQ0MsU0FBUyxFQUFFO1lBQ1QsTUFBTUosT0FBTyxFQUFDLEVBQUVBLE9BQU8sR0FBRUssS0FBSyxHQUFFLEVBQUU7Z0JBQ2hDTCxPQUFPLENBQUNSLE9BQU8sR0FBR2EsS0FBSyxDQUFDQyxHQUFHO2dCQUMzQk4sT0FBTyxDQUFDTyxJQUFJLENBQUN0QyxJQUFJLEdBQUdvQyxLQUFLLENBQUNDLEdBQUc7Z0JBQzdCTixPQUFPLENBQUNPLElBQUksQ0FBQ0MsS0FBSyxHQUFHLG9DQUFvQztnQkFDekQsT0FBT1IsT0FBTztZQUNoQixDQUFDO1NBQ0Y7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RhaWx3aW5kdWktcG9ja2V0Ly4vc3JjL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0uanM/NzhhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiXG5pbXBvcnQgeyBnZXRDc3JmVG9rZW4gfSBmcm9tIFwibmV4dC1hdXRoL3JlYWN0XCJcbmltcG9ydCB7IFNpd2VNZXNzYWdlIH0gZnJvbSBcInNpd2VcIlxuXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBlYWNoIG9wdGlvbiAoYW5kIGEgZnVsbCBsaXN0IG9mIG9wdGlvbnMpIGdvIHRvXG4vLyBodHRwczovL25leHQtYXV0aC5qcy5vcmcvY29uZmlndXJhdGlvbi9vcHRpb25zXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRoKHJlcSwgcmVzKSB7XG4gIGNvbnN0IHByb3ZpZGVycyA9IFtcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6IFwiRXRoZXJldW1cIixcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgICBsYWJlbDogXCJNZXNzYWdlXCIsXG4gICAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IFwiMHgwXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHNpZ25hdHVyZToge1xuICAgICAgICAgIGxhYmVsOiBcIlNpZ25hdHVyZVwiLFxuICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIjB4MFwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHNpd2UgPSBuZXcgU2l3ZU1lc3NhZ2UoSlNPTi5wYXJzZShjcmVkZW50aWFscz8ubWVzc2FnZSB8fCBcInt9XCIpKVxuICAgICAgICAgIGNvbnN0IG5leHRBdXRoVXJsID0gbmV3IFVSTChwcm9jZXNzLmVudi5ORVhUQVVUSF9VUkwpXG5cbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzaXdlLnZlcmlmeSh7XG4gICAgICAgICAgICBzaWduYXR1cmU6IGNyZWRlbnRpYWxzPy5zaWduYXR1cmUgfHwgXCJcIixcbiAgICAgICAgICAgIGRvbWFpbjogbmV4dEF1dGhVcmwuaG9zdCxcbiAgICAgICAgICAgIG5vbmNlOiBhd2FpdCBnZXRDc3JmVG9rZW4oeyByZXEgfSksXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgaWQ6IHNpd2UuYWRkcmVzcyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSksXG4gIF1cblxuICBjb25zdCBpc0RlZmF1bHRTaWduaW5QYWdlID1cbiAgICByZXEubWV0aG9kID09PSBcIkdFVFwiICYmIHJlcS5xdWVyeS5uZXh0YXV0aC5pbmNsdWRlcyhcInNpZ25pblwiKVxuXG4gIC8vIEhpZGUgU2lnbi1JbiB3aXRoIEV0aGVyZXVtIGZyb20gZGVmYXVsdCBzaWduIHBhZ2VcbiAgaWYgKGlzRGVmYXVsdFNpZ25pblBhZ2UpIHtcbiAgICBwcm92aWRlcnMucG9wKClcbiAgfVxuXG4gIHJldHVybiBhd2FpdCBOZXh0QXV0aChyZXEsIHJlcywge1xuICAgIC8vIGh0dHBzOi8vbmV4dC1hdXRoLmpzLm9yZy9jb25maWd1cmF0aW9uL3Byb3ZpZGVycy9vYXV0aFxuICAgIHByb3ZpZGVycyxcbiAgICBzZXNzaW9uOiB7XG4gICAgICBzdHJhdGVneTogXCJqd3RcIixcbiAgICB9LFxuICAgIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxuICAgIGNhbGxiYWNrczoge1xuICAgICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcbiAgICAgICAgc2Vzc2lvbi5hZGRyZXNzID0gdG9rZW4uc3ViXG4gICAgICAgIHNlc3Npb24udXNlci5uYW1lID0gdG9rZW4uc3ViXG4gICAgICAgIHNlc3Npb24udXNlci5pbWFnZSA9IFwiaHR0cHM6Ly93d3cuZmlsbG11cnJheS5jb20vMTI4LzEyOFwiXG4gICAgICAgIHJldHVybiBzZXNzaW9uXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG59Il0sIm5hbWVzIjpbIk5leHRBdXRoIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsImdldENzcmZUb2tlbiIsIlNpd2VNZXNzYWdlIiwiYXV0aCIsInJlcSIsInJlcyIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsIm1lc3NhZ2UiLCJsYWJlbCIsInR5cGUiLCJwbGFjZWhvbGRlciIsInNpZ25hdHVyZSIsImF1dGhvcml6ZSIsInNpd2UiLCJKU09OIiwicGFyc2UiLCJuZXh0QXV0aFVybCIsIlVSTCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9VUkwiLCJyZXN1bHQiLCJ2ZXJpZnkiLCJkb21haW4iLCJob3N0Iiwibm9uY2UiLCJzdWNjZXNzIiwiaWQiLCJhZGRyZXNzIiwiZSIsImlzRGVmYXVsdFNpZ25pblBhZ2UiLCJtZXRob2QiLCJxdWVyeSIsIm5leHRhdXRoIiwiaW5jbHVkZXMiLCJwb3AiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJzZWNyZXQiLCJORVhUQVVUSF9TRUNSRVQiLCJjYWxsYmFja3MiLCJ0b2tlbiIsInN1YiIsInVzZXIiLCJpbWFnZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/auth/[...nextauth].js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./src/pages/api/auth/[...nextauth].js"));
module.exports = __webpack_exports__;

})();