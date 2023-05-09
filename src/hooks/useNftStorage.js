import { Blob, NFTStorage } from "nft.storage"

const useNftStorage = () => {
    const endpoint = "https://api.nft.storage"
    const token = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY 

    const storage = new NFTStorage({ endpoint, token })

    const uploadMetadata = async (file) => {
        const blob = new Blob([file], { type: "application/json" })
        return await storage.storeBlob(blob)
    }

    return { uploadMetadata }

    
}

export default useNftStorage