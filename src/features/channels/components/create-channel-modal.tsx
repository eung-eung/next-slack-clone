import React, { useState } from 'react'
import { useCreateChannelModal } from '../store/use-create-channel-modal'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateChannel } from '../api/use-create-channel'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


export default function CreateChannelModal() {
    const router = useRouter()
    const [open, setOpen] = useCreateChannelModal()
    const [name, setName] = useState("")

    const workspaceId = useWorkspaceId()

    const { mutate, isPending } = useCreateChannel()
    const handleClose = () => {
        setName("")
        setOpen(false)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({
            name,
            workspaceId
        }, {
            onSuccess: (id) => {
                toast.success("Channel created")
                //TODO: redirect to new channel
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                handleClose()
            },
            onError: () => {
                toast.error("Failed to create channel")
            }
        }
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setName(value)
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Input
                        disabled={isPending}
                        value={name}
                        onChange={handleChange}
                        autoFocus
                        required
                        minLength={3}
                        maxLength={80}
                        placeholder='e.g. plan-budget'
                    />
                    <div className='flex justify-end'>
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
