 
export const calibration = {
  id: 314159,
  name: 'Filecoin Calibration Network',
  network: 'calibration',
  nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'FIL',
  },
  rpcUrls: {
    public: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
    default: { http: ['https://api.calibration.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    etherscan: { name: 'Calibration', url: 'https://calibration.filfox.info/' },
    default: { name: 'Default', url:'https://calibration.filfox.info/' },
  }
} 