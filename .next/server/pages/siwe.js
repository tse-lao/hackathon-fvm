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
exports.id = "pages/siwe";
exports.ids = ["pages/siwe"];
exports.modules = {

/***/ "./src/pages/siwe.jsx":
/*!****************************!*\
  !*** ./src/pages/siwe.jsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"getServerSideProps\": () => (/* binding */ getServerSideProps)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @rainbow-me/rainbowkit-siwe-next-auth */ \"@rainbow-me/rainbowkit-siwe-next-auth\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! siwe */ \"siwe\");\n/* harmony import */ var siwe__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(siwe__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/connectors/injected */ \"wagmi/connectors/injected\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__]);\n([_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_5__, wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\nfunction Siwe() {\n    const { signMessageAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useSignMessage)();\n    const { chain  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useNetwork)();\n    const { address , isConnected  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useAccount)();\n    const { connect  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_5__.useConnect)({\n        connector: new wagmi_connectors_injected__WEBPACK_IMPORTED_MODULE_6__.InjectedConnector()\n    });\n    const { data: session , status  } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.useSession)();\n    const getSiweMessageOptions = ()=>({\n            statement: \"Sign in to my RainbowKit app\"\n        });\n    const handleLogin = async ()=>{\n        try {\n            const callbackUrl = \"/protected\";\n            const message = new siwe__WEBPACK_IMPORTED_MODULE_4__.SiweMessage({\n                domain: window.location.host,\n                address: address,\n                statement: \"Sign in with Ethereum to the app.\",\n                uri: window.location.origin,\n                version: \"1\",\n                chainId: chain?.id,\n                nonce: await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.getCsrfToken)()\n            });\n            const signature = await signMessageAsync({\n                message: message.prepareMessage()\n            });\n            (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.signIn)(\"credentials\", {\n                message: JSON.stringify(message),\n                redirect: false,\n                signature,\n                callbackUrl\n            });\n        } catch (error) {\n            window.alert(error);\n        }\n    };\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        console.log(isConnected);\n        if (isConnected && !session) {\n            handleLogin();\n        }\n    }, [\n        isConnected\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_1__.RainbowKitSiweNextAuthProvider, {\n            getSiweMessageOptions: getSiweMessageOptions,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: (e)=>{\n                    e.preventDefault();\n                    if (!isConnected) {\n                        connect();\n                    } else {\n                        handleLogin();\n                    }\n                },\n                children: \"Sign-in\"\n            }, void 0, false, {\n                fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/siwe.jsx\",\n                lineNumber: 61,\n                columnNumber: 17\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/siwe.jsx\",\n            lineNumber: 58,\n            columnNumber: 13\n        }, this)\n    }, void 0, false);\n}\nasync function getServerSideProps(context) {\n    return {\n        props: {\n            csrfToken: await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.getCsrfToken)(context)\n        }\n    };\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Siwe);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YWNrOi8vdGFpbHdpbmR1aS1wb2NrZXQvLi9zcmMvcGFnZXMvc2l3ZS5qc3g/YTJjYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIFJhaW5ib3dLaXRTaXdlTmV4dEF1dGhQcm92aWRlclxufSBmcm9tICdAcmFpbmJvdy1tZS9yYWluYm93a2l0LXNpd2UtbmV4dC1hdXRoJ1xuaW1wb3J0IHsgZ2V0Q3NyZlRva2VuLCBzaWduSW4sIHVzZVNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoL3JlYWN0XCJcbmltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQgeyBTaXdlTWVzc2FnZSB9IGZyb20gXCJzaXdlXCJcbmltcG9ydCB7IHVzZUFjY291bnQsIHVzZUNvbm5lY3QsIHVzZU5ldHdvcmssIHVzZVNpZ25NZXNzYWdlIH0gZnJvbSBcIndhZ21pXCJcbmltcG9ydCB7IEluamVjdGVkQ29ubmVjdG9yIH0gZnJvbSAnd2FnbWkvY29ubmVjdG9ycy9pbmplY3RlZCdcblxuZnVuY3Rpb24gU2l3ZSgpIHtcbiAgICBjb25zdCB7IHNpZ25NZXNzYWdlQXN5bmMgfSA9IHVzZVNpZ25NZXNzYWdlKClcbiAgICBjb25zdCB7IGNoYWluIH0gPSB1c2VOZXR3b3JrKClcbiAgICBjb25zdCB7IGFkZHJlc3MsIGlzQ29ubmVjdGVkIH0gPSB1c2VBY2NvdW50KClcbiAgICBjb25zdCB7IGNvbm5lY3QgfSA9IHVzZUNvbm5lY3Qoe1xuICAgICAgICBjb25uZWN0b3I6IG5ldyBJbmplY3RlZENvbm5lY3RvcigpLFxuICAgIH0pO1xuICAgIGNvbnN0IHsgZGF0YTogc2Vzc2lvbiwgc3RhdHVzIH0gPSB1c2VTZXNzaW9uKClcblxuICAgIGNvbnN0IGdldFNpd2VNZXNzYWdlT3B0aW9ucyA9ICgpID0+ICh7XG4gICAgICAgIHN0YXRlbWVudDogJ1NpZ24gaW4gdG8gbXkgUmFpbmJvd0tpdCBhcHAnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGFuZGxlTG9naW4gPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja1VybCA9IFwiL3Byb3RlY3RlZFwiXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IFNpd2VNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBkb21haW46IHdpbmRvdy5sb2NhdGlvbi5ob3N0LFxuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgICAgICAgICAgICAgc3RhdGVtZW50OiBcIlNpZ24gaW4gd2l0aCBFdGhlcmV1bSB0byB0aGUgYXBwLlwiLFxuICAgICAgICAgICAgICAgIHVyaTogd2luZG93LmxvY2F0aW9uLm9yaWdpbixcbiAgICAgICAgICAgICAgICB2ZXJzaW9uOiBcIjFcIixcbiAgICAgICAgICAgICAgICBjaGFpbklkOiBjaGFpbj8uaWQsXG4gICAgICAgICAgICAgICAgbm9uY2U6IGF3YWl0IGdldENzcmZUb2tlbigpLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IGF3YWl0IHNpZ25NZXNzYWdlQXN5bmMoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UucHJlcGFyZU1lc3NhZ2UoKSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBzaWduSW4oXCJjcmVkZW50aWFsc1wiLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogSlNPTi5zdHJpbmdpZnkobWVzc2FnZSksXG4gICAgICAgICAgICAgICAgcmVkaXJlY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNpZ25hdHVyZSxcbiAgICAgICAgICAgICAgICBjYWxsYmFja1VybCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhpc0Nvbm5lY3RlZCk7XG4gICAgICAgIGlmIChpc0Nvbm5lY3RlZCAmJiAhc2Vzc2lvbikge1xuICAgICAgICAgICAgaGFuZGxlTG9naW4oKVxuICAgICAgICB9XG4gICAgfSwgW2lzQ29ubmVjdGVkXSlcblxuICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgICA8UmFpbmJvd0tpdFNpd2VOZXh0QXV0aFByb3ZpZGVyXG4gICAgICAgICAgICAgICAgZ2V0U2l3ZU1lc3NhZ2VPcHRpb25zPXtnZXRTaXdlTWVzc2FnZU9wdGlvbnN9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUxvZ2luKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIFNpZ24taW5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvUmFpbmJvd0tpdFNpd2VOZXh0QXV0aFByb3ZpZGVyPlxuICAgICAgICA8Lz5cblxuICAgIClcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlcnZlclNpZGVQcm9wcyhjb250ZXh0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcHJvcHM6IHtcbiAgICAgICAgICAgIGNzcmZUb2tlbjogYXdhaXQgZ2V0Q3NyZlRva2VuKGNvbnRleHQpLFxuICAgICAgICB9LFxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTaXdlIl0sIm5hbWVzIjpbIlJhaW5ib3dLaXRTaXdlTmV4dEF1dGhQcm92aWRlciIsImdldENzcmZUb2tlbiIsInNpZ25JbiIsInVzZVNlc3Npb24iLCJ1c2VFZmZlY3QiLCJTaXdlTWVzc2FnZSIsInVzZUFjY291bnQiLCJ1c2VDb25uZWN0IiwidXNlTmV0d29yayIsInVzZVNpZ25NZXNzYWdlIiwiSW5qZWN0ZWRDb25uZWN0b3IiLCJTaXdlIiwic2lnbk1lc3NhZ2VBc3luYyIsImNoYWluIiwiYWRkcmVzcyIsImlzQ29ubmVjdGVkIiwiY29ubmVjdCIsImNvbm5lY3RvciIsImRhdGEiLCJzZXNzaW9uIiwic3RhdHVzIiwiZ2V0U2l3ZU1lc3NhZ2VPcHRpb25zIiwic3RhdGVtZW50IiwiaGFuZGxlTG9naW4iLCJjYWxsYmFja1VybCIsIm1lc3NhZ2UiLCJkb21haW4iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3QiLCJ1cmkiLCJvcmlnaW4iLCJ2ZXJzaW9uIiwiY2hhaW5JZCIsImlkIiwibm9uY2UiLCJzaWduYXR1cmUiLCJwcmVwYXJlTWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZWRpcmVjdCIsImVycm9yIiwiYWxlcnQiLCJjb25zb2xlIiwibG9nIiwiYnV0dG9uIiwib25DbGljayIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImdldFNlcnZlclNpZGVQcm9wcyIsImNvbnRleHQiLCJwcm9wcyIsImNzcmZUb2tlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/siwe.jsx\n");

/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("next-auth/react");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "siwe":
/*!***********************!*\
  !*** external "siwe" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("siwe");

/***/ }),

/***/ "@rainbow-me/rainbowkit-siwe-next-auth":
/*!********************************************************!*\
  !*** external "@rainbow-me/rainbowkit-siwe-next-auth" ***!
  \********************************************************/
/***/ ((module) => {

module.exports = import("@rainbow-me/rainbowkit-siwe-next-auth");;

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/connectors/injected":
/*!********************************************!*\
  !*** external "wagmi/connectors/injected" ***!
  \********************************************/
/***/ ((module) => {

module.exports = import("wagmi/connectors/injected");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/siwe.jsx"));
module.exports = __webpack_exports__;

})();