"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/pages/_app.jsx":
/*!****************************!*\
  !*** ./src/pages/_app.jsx ***!
  \****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ App; }\n/* harmony export */ });\n/* harmony import */ var _swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @swc/helpers/src/_object_spread.mjs */ \"./node_modules/@swc/helpers/src/_object_spread.mjs\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/styles/tailwind.css */ \"./src/styles/tailwind.css\");\n/* harmony import */ var _styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_tailwind_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @rainbow-me/rainbowkit-siwe-next-auth */ \"./node_modules/@rainbow-me/rainbowkit-siwe-next-auth/dist/index.js\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.js\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @rainbow-me/rainbowkit/styles.css */ \"./node_modules/@rainbow-me/rainbowkit/dist/index.css\");\n/* harmony import */ var _rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_rainbow_me_rainbowkit_styles_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-auth/react */ \"./node_modules/next-auth/react/index.js\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! wagmi */ \"./node_modules/wagmi/dist/index.js\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wagmi/chains */ \"./node_modules/wagmi/dist/chains.js\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! wagmi/providers/public */ \"./node_modules/wagmi/dist/providers/public.js\");\n/* provided dependency */ var process = __webpack_require__(/*! process */ \"./node_modules/next/dist/build/polyfills/process.js\");\n\n\n\n\n\n\n\n\n\n\nfunction App(param) {\n    var Component = param.Component, pageProps = param.pageProps;\n    var chains = (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.configureChains)([\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.mainnet,\n        wagmi_chains__WEBPACK_IMPORTED_MODULE_5__.polygon\n    ], [\n        alchemyProvider({\n            apiKey: process.env.ALCHEMY_ID\n        }),\n        (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_6__.publicProvider)(), \n    ]).chains;\n    var client = (0,wagmi__WEBPACK_IMPORTED_MODULE_4__.createClient)({\n        autoConnect: true,\n        provider: provider\n    });\n    var connectors = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_7__.getDefaultWallets)({\n        appName: \"DataHack\",\n        projectId: \"YOUR_PROJECT_ID\",\n        chains: chains\n    }).connectors;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(wagmi__WEBPACK_IMPORTED_MODULE_4__.WagmiConfig, {\n        client: client,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_auth_react__WEBPACK_IMPORTED_MODULE_3__.SessionProvider, {\n            refetchInterval: 0,\n            session: pageProps.session,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit_siwe_next_auth__WEBPACK_IMPORTED_MODULE_8__.RainbowKitSiweNextAuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_7__.RainbowKitProvider, {\n                    chains: chains,\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, (0,_swc_helpers_src_object_spread_mjs__WEBPACK_IMPORTED_MODULE_9__[\"default\"])({}, pageProps), void 0, false, {\n                        fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                        lineNumber: 40,\n                        columnNumber: 13\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                    lineNumber: 39,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n                lineNumber: 38,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n            lineNumber: 37,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/koenschuite/github/connectfast/data/src/pages/_app.jsx\",\n        lineNumber: 36,\n        columnNumber: 3\n    }, this);\n};\n_c = App;\nvar _c;\n$RefreshReg$(_c, \"App\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qc3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUErQjtBQUN3RDtBQUVSO0FBQ3BDO0FBQ087QUFDaUI7QUFDbkI7QUFDUTtBQUl6QyxTQUFTVSxHQUFHLENBQUMsS0FBd0IsRUFBRTtRQUF4QkMsU0FBUyxHQUFYLEtBQXdCLENBQXRCQSxTQUFTLEVBQUVDLFNBQVMsR0FBdEIsS0FBd0IsQ0FBWEEsU0FBUztJQUNoRCxJQUFNLE1BQVEsR0FBS1Asc0RBQWUsQ0FDaEM7UUFBQ0UsaURBQU87UUFBRUMsaURBQU87S0FBQyxFQUNsQjtRQUNFTSxlQUFlLENBQUM7WUFBRUMsTUFBTSxFQUFFQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0MsVUFBVTtTQUFFLENBQUM7UUFDbkRULHNFQUFjLEVBQUU7S0FDakIsQ0FDRixDQU5PSSxNQUFNO0lBUWQsSUFBTU0sTUFBTSxHQUFHYixtREFBWSxDQUFDO1FBQzFCYyxXQUFXLEVBQUUsSUFBSTtRQUNqQkMsUUFBUSxFQUFSQSxRQUFRO0tBQ1QsQ0FBQztJQUdGLElBQU0sVUFBWSxHQUFLbkIseUVBQWlCLENBQUM7UUFDdkNxQixPQUFPLEVBQUUsVUFBVTtRQUNuQkMsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QlgsTUFBTSxFQUFOQSxNQUFNO0tBQ1AsQ0FBQyxDQUpNUyxVQUFVO0lBT2xCLHFCQUNBLDhEQUFDbEIsOENBQVc7UUFBQ2UsTUFBTSxFQUFFQSxNQUFNO2tCQUN2Qiw0RUFBQ2hCLDREQUFlO1lBQUNzQixlQUFlLEVBQUUsQ0FBQztZQUFFQyxPQUFPLEVBQUVkLFNBQVMsQ0FBQ2MsT0FBTztzQkFDN0QsNEVBQUMxQixpR0FBOEI7MEJBQzdCLDRFQUFDQyxzRUFBa0I7b0JBQUNZLE1BQU0sRUFBRUEsTUFBTTs4QkFDaEMsNEVBQUNGLFNBQVMscUZBQUtDLFNBQVM7Ozs7NEJBQUk7Ozs7O3dCQUNUOzs7OztvQkFDVTs7Ozs7Z0JBQ2pCOzs7OztZQUNOLENBQ2Q7QUFDSixDQUFDO0FBakN1QkYsS0FBQUEsR0FBRyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvcGFnZXMvX2FwcC5qc3g/NGM3NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ0Avc3R5bGVzL3RhaWx3aW5kLmNzcyc7XG5pbXBvcnQgeyBSYWluYm93S2l0U2l3ZU5leHRBdXRoUHJvdmlkZXIgfSBmcm9tICdAcmFpbmJvdy1tZS9yYWluYm93a2l0LXNpd2UtbmV4dC1hdXRoJztcblxuaW1wb3J0IHsgUmFpbmJvd0tpdFByb3ZpZGVyLCBnZXREZWZhdWx0V2FsbGV0cyB9IGZyb20gJ0ByYWluYm93LW1lL3JhaW5ib3draXQnO1xuaW1wb3J0ICdAcmFpbmJvdy1tZS9yYWluYm93a2l0L3N0eWxlcy5jc3MnO1xuaW1wb3J0IHsgU2Vzc2lvblByb3ZpZGVyIH0gZnJvbSAnbmV4dC1hdXRoL3JlYWN0JztcbmltcG9ydCB7IFdhZ21pQ29uZmlnLCBjb25maWd1cmVDaGFpbnMsIGNyZWF0ZUNsaWVudCB9IGZyb20gJ3dhZ21pJztcbmltcG9ydCB7IG1haW5uZXQsIHBvbHlnb24gfSBmcm9tICd3YWdtaS9jaGFpbnMnO1xuaW1wb3J0IHsgcHVibGljUHJvdmlkZXIgfSBmcm9tIFwid2FnbWkvcHJvdmlkZXJzL3B1YmxpY1wiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICBjb25zdCB7IGNoYWlucyB9ID0gY29uZmlndXJlQ2hhaW5zKFxuICAgIFttYWlubmV0LCBwb2x5Z29uXSxcbiAgICBbXG4gICAgICBhbGNoZW15UHJvdmlkZXIoeyBhcGlLZXk6IHByb2Nlc3MuZW52LkFMQ0hFTVlfSUQgfSksXG4gICAgICBwdWJsaWNQcm92aWRlcigpLFxuICAgIF1cbiAgKTtcbiAgXG4gIGNvbnN0IGNsaWVudCA9IGNyZWF0ZUNsaWVudCh7XG4gICAgYXV0b0Nvbm5lY3Q6IHRydWUsXG4gICAgcHJvdmlkZXIsXG4gIH0pXG4gIFxuICBcbiAgY29uc3QgeyBjb25uZWN0b3JzIH0gPSBnZXREZWZhdWx0V2FsbGV0cyh7XG4gICAgYXBwTmFtZTogJ0RhdGFIYWNrJyxcbiAgICBwcm9qZWN0SWQ6ICdZT1VSX1BST0pFQ1RfSUQnLFxuICAgIGNoYWluc1xuICB9KTtcbiAgXG4gIFxuICByZXR1cm4gKFxuICA8V2FnbWlDb25maWcgY2xpZW50PXtjbGllbnR9PlxuICAgICAgPFNlc3Npb25Qcm92aWRlciByZWZldGNoSW50ZXJ2YWw9ezB9IHNlc3Npb249e3BhZ2VQcm9wcy5zZXNzaW9ufT5cbiAgICAgICAgPFJhaW5ib3dLaXRTaXdlTmV4dEF1dGhQcm92aWRlcj5cbiAgICAgICAgICA8UmFpbmJvd0tpdFByb3ZpZGVyIGNoYWlucz17Y2hhaW5zfSA+XG4gICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgICAgPC9SYWluYm93S2l0UHJvdmlkZXI+XG4gICAgICAgIDwvUmFpbmJvd0tpdFNpd2VOZXh0QXV0aFByb3ZpZGVyPlxuICAgICAgPC9TZXNzaW9uUHJvdmlkZXI+XG4gICAgPC9XYWdtaUNvbmZpZz5cbiAgIClcbn1cbiJdLCJuYW1lcyI6WyJSYWluYm93S2l0U2l3ZU5leHRBdXRoUHJvdmlkZXIiLCJSYWluYm93S2l0UHJvdmlkZXIiLCJnZXREZWZhdWx0V2FsbGV0cyIsIlNlc3Npb25Qcm92aWRlciIsIldhZ21pQ29uZmlnIiwiY29uZmlndXJlQ2hhaW5zIiwiY3JlYXRlQ2xpZW50IiwibWFpbm5ldCIsInBvbHlnb24iLCJwdWJsaWNQcm92aWRlciIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImNoYWlucyIsImFsY2hlbXlQcm92aWRlciIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJBTENIRU1ZX0lEIiwiY2xpZW50IiwiYXV0b0Nvbm5lY3QiLCJwcm92aWRlciIsImNvbm5lY3RvcnMiLCJhcHBOYW1lIiwicHJvamVjdElkIiwicmVmZXRjaEludGVydmFsIiwic2Vzc2lvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/pages/_app.jsx\n"));

/***/ })

});