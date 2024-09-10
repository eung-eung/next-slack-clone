'use client'

import { useEffect, useMemo } from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter()
  const { data, isLoading } = useGetWorkspaces()

  // open: global state
  const [open, setOpen] = useCreateWorkspaceModal()

  const workspaceId = useMemo(() => data?.[0]?._id, [data])
  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      console.log('Open creation modal');
      setOpen(true)
    }
  }, [workspaceId, isLoading, open, setOpen, router])
  return (
    <div>

    </div>

  );
}
