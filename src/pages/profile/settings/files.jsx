"use client"
import CreateSpace from "@/components/application/CreateSpace";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useAccount } from "wagmi";
import SettingsLayout from "./SettingsLayout";


export default function FilesSettings() {
  const mounted = useIsMounted();
  const { address } = useAccount();
  return (
    <SettingsLayout active="Files">
      <div className="divide-y divide-gray-200 lg:col-span-9" >

        {mounted ? address && (
          <CreateSpace address={address} />
        ) : null}

      </div>
    </SettingsLayout>
  )
}
