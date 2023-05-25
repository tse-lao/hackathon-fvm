// Web3Auth Libraries
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

export default function Web3AuthConnectorInstance(chains) {
    // Create Web3Auth Instance
    const name = "DataBridge";
    const iconUrl = "https://web3auth.io/docs/contents/logo-ethereum.png";
    const web3AuthInstance = new Web3Auth({
    clientId: "BCmQU7Ekt9a8CatSGk2R2sm5lNocUU5nL8Ttodl0rDFJLr4oXktJWbTA4EfAW3V5C8HJwvNVhdRpQDL5SCr9WN0",
    chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x13881", // hex of 80001, polygon testnet
        rpcTarget: "https://rpc.ankr.com/polygon_mumbai	",
        // Avoid using public rpcTarget in production.
        // Use services like Infura, Quicknode etc
        displayName: "Polygon Mumbai Testnet",
        blockExplorer: "https://mumbai.polygonscan.com/",
        ticker: "MATIC",
        tickerName: "Matic",
    },
    uiConfig: {
        appName: name,
        theme: "light",
        loginMethodsOrder: ["facebook", "google"],
        defaultLanguage: "en",
        appLogo: "https://web3auth.io/images/w3a-L-Favicon-1.svg", // Your App Logo Here
        modalZIndex: "2147483647",
    },
    });

    // Add openlogin adapter for customisations
    const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
        network: "cyan",
        uxMode: "popup", 
        whiteLabel: {
        name: "DataBridge",
        logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
        logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
        defaultLanguage: "en",
        dark: false, // whether to enable dark mode. defaultValue: false
        },
    },
    });
    web3AuthInstance.configureAdapter(openloginAdapterInstance);

    // Add Torus Wallet Plugin (optional)
    const torusPlugin = new TorusWalletConnectorPlugin({
    torusWalletOpts: {
        buttonPosition: "bottom-left",
    },
    walletInitOptions: {
        whiteLabel: {
        theme: { isDark: false, colors: { primary: "#00a8ff" } },
        logoDark: iconUrl,
        logoLight: iconUrl,
        },
        useWalletConnect: true,
        enableLogging: true,
    },
    });
    web3AuthInstance.addPlugin(torusPlugin);

    return new Web3AuthConnector({
        chains: chains,
        options: {
          web3AuthInstance,
        },
      });
}