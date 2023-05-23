import Marketplace from "@/components/marketplace/Marketplace";
import Layout from "../Layout";

export default function Market() {
    return (
        <Layout title="Market" active="Market">
            <div className="">
                <Marketplace />
            </div>
        </Layout>
    )
}
