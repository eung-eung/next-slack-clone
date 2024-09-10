'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'
import { useCreateWorkspace } from '../api/use-create-workspace'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CreateWorkspaceModal() {
    const router = useRouter()
    const [open, setOpen] = useCreateWorkspaceModal()
    const [name, setName] = useState("")
    const { mutate, isPending } = useCreateWorkspace()
    const handleClose = () => {
        setOpen(false)
        //TODO: clear form
        setName('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = await mutate({
            name: name
        }, {
            onSuccess(id) {
                console.log(id)
                toast.success("Workspace created")
                router.push(`/workspace/${id}`)
                handleClose()
            },
            onError(error) {

            },
        })
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <Input
                            value={name}
                            onChange={(ev) => setName(ev.target.value)}
                            disabled={isPending}
                            required
                            autoFocus
                            minLength={3}
                            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                        />
                        <div className='flex justify-end'>
                            <Button disabled={isPending}>
                                Create
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
