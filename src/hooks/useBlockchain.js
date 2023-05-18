import { Alchemy, Network } from "alchemy-sdk"

import { DB_NFT_address } from "@/constants"

const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    network: Network.MATIC_MUMBAI
}

const alchemy = new Alchemy(config)

export async function getNfts(address) {
    const nfts = await alchemy.nft.getNftsForOwner(address, {
        contractAddresses: [DB_NFT_address]
    })
    let nftsData = []
    for (const nft of nfts.ownedNfts) {
        // @ts-ignore

        nftsData.push(nft)
    }
    return nftsData
}