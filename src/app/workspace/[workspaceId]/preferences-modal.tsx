import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from 'lucide-react'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'
import { Input } from '@/components/ui/input'
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useConfirm } from '@/hooks/use-confirm'

interface PreferencesModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    initialValue: string
}

export default function PreferencesModal(
    {
        open,
        setOpen,
        initialValue
    }: PreferencesModalProps
) {
    const [ConfirmDialog, confirmRemove] = useConfirm(
        "Are you sure?",
        "This action is irreversible"
    )

    const workspaceId = useWorkspaceId()
    const [value, setValue] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)
    const { mutate: updateWorkspace, isPending: isUpdateWorkspace } = useUpdateWorkspace()
    const { mutate: removeWorkspace, isPending: isRemoveWorkspace } = useRemoveWorkspace()

    const router = useRouter()

    const handleRemove = async () => {
        const ok = await confirmRemove()
        if (!ok) return

        removeWorkspace({
            id: workspaceId
        }, {
            onSuccess: () => {
                router.replace('/')
                toast.success("Workspace removed")
            },
            onError: () => {
                toast.error("Failed to remove workspace")
            }
        })
    }

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess: () => {
                setEditOpen(false)
                toast.success("Workspace updated")
            },
            onError: () => {
                toast.error("Failed to update workspace")
            }
        },)
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className='px-5 py-4 bg-white rounded-lg border cur hover:bg-gray-50'>
                                    <div className='flex item justify-between'>
                                        <p className='text-sm font-semibold'>
                                            Workspace name
                                        </p>
                                        <p className='text-sm text-[#158fec]  hover:underline font-semibold'>
                                            Edit
                                        </p>
                                    </div>
                                    <p className='text-sm'>
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this workspace
                                    </DialogTitle>
                                </DialogHeader>
                                <form className='space-y-4' onSubmit={handleEdit}>
                                    <Input
                                        value={value}
                                        disabled={isUpdateWorkspace}
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="'Workplace name e.g 'Work', 'Personal', 'Home'"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isUpdateWorkspace}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdateWorkspace}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button
                            disabled={isRemoveWorkspace}
                            onClick={handleRemove}
                            className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-500'
                        >
                            <TrashIcon className='size-4' />
                            <p className='text-sm font-semibold'>Delete workspace</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
