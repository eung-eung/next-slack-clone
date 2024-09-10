import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { CopyIcon, RefreshCcw } from 'lucide-react'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { toast } from 'sonner'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'
import { DialogClose } from '@radix-ui/react-dialog'
import { useConfirm } from '@/hooks/use-confirm'

interface InviteModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    joinCode: string,
    name: string
}

export default function InviteModal({
    open,
    setOpen,
    name,
    joinCode
}: InviteModalProps) {
    const workspaceId = useWorkspaceId()
    const { mutate, isPending } = useNewJoinCode()
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactive the current invite code and generate a new one"
    )

    const handleNewCode = async () => {
        const ok = await confirm()
        if (!ok) return
        mutate({
            workspaceId
        }, {
            onSuccess: () => {
                toast.success("Invite code regenrated")
            },
            onError: () => {
                toast.error("Failed to regenerate invite code")
            }
        })
    }

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`

        //window.navigator == navigator
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                toast("Invite link copied to clipboard")
            })
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogHeader>Invite people to {name}</DialogHeader>
                        <DialogDescription>
                            Use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
                        <p className='text-4xl font-bold tracking-widest uppercase'>
                            {joinCode}
                        </p>
                        <Button
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm">
                            Copy link
                            <CopyIcon className='size-4 ml-2' />
                        </Button>
                    </div>
                    <div className='flex items-center justify-between w-full'>
                        <Button
                            disabled={isPending}
                            onClick={handleNewCode}
                            variant="outline"
                        >
                            New code
                            <RefreshCcw className='size-4 ml-2' />
                        </Button>
                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
