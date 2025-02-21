"use client"
import { AlertTriangle, Loader } from 'lucide-react'
import React, { useEffect } from 'react'
import { useCreateOrGerConversation } from '@/features/conversation/api/use-create-or-get-conversation'
import { useMemberId } from '@/hooks/use-member-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { toast } from 'sonner'
import Conversation from './conversation'

export default function MemberIdPage() {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()

    const { data, mutate, isPending } = useCreateOrGerConversation()

    useEffect(() => {
        mutate({
            workspaceId,
            memberId
        }, {
            onError: () => {
                toast.error("Error when go to this conversation")
            }
        })
    }, [workspaceId, memberId, mutate])

    if (isPending) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }
    if (!data) {
        return (
            <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                <AlertTriangle className="size-6 text-muted-foreground" />
                <span className='text-sm text-muted-foreground'>
                    Conversation not found
                </span>
            </div>
        )
    }
    return (
        <Conversation id={data._id} />
    )
}
