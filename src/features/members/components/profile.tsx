import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMember } from '../api/use-get-member'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useUpdateMember } from '../api/use-update-member'
import { useRemoveMember } from '../api/use-remove-member'
import { useCurrentMember } from '../api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'


interface ProfileProps {
    memberId: Id<"members">,
    onClose: () => void
}
export default function Profile({
    memberId,
    onClose
}: ProfileProps) {
    const workspaceId = useWorkspaceId()
    const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId })
    const { data: curentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    })

    const { mutate: updateMember, isPending: isLoadingUpdateMember } = useUpdateMember()
    const { mutate: removeMember, isPending: isLoadingRemoveMember } = useRemoveMember()

    if (isLoadingMember || isLoadingCurrentMember) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex h-[49px] justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <Loader className="size-6 animate-spin text-muted-foreground" />
                </div>
            </div>

        )
    }

    if (!member) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex h-[49px] justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
                    <AlertTriangle className="size-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Profile not found</p>
                </div>
            </div>
        )
    }

    const avatarFallback = member.user.name?.charAt(0).toUpperCase()
    return (
        <div className="h-full flex flex-col">
            <div className="flex h-[49px] justify-between items-center px-4 border-b">
                <p className="text-lg font-bold">Profile</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div className="flex items-center justify-center flex-col p-4">
                <Avatar className='max-w-[200px] max-h-[200px] size-full object-contain'>
                    <AvatarImage src={member.user.image} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
            </div>
            <div className='flex-flex-col p-4'>
                <p className='text-xl font-bold'>{member.user.name}</p>
                {/* current member is admin + member's profile is not current member*/}
                {curentMember?.role === "admin" &&
                    curentMember._id !== memberId ? (
                    <div className='flex items-center gap-2 mt-4'>
                        <Button variant="outline" className='w-full capitalize'>
                            {member.role} <ChevronDownIcon className='size-4 ml-2' />
                        </Button>
                        <Button variant="outline" className='w-full'>
                            Remove
                        </Button>
                    </div>
                ) : curentMember?._id === memberId && curentMember.role !== "admin" ? (
                    <div className='mt-4'>
                        <Button variant="outline" className='w-full'>
                            Leave
                        </Button>
                    </div>
                ) : null
                }
            </div>
            <Separator />
            <div className='flex flex-col p-4'>
                <p className='text-sm font-bold mb-4'>Contact information</p>
                <div className='flex items-center gap-2'>
                    <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
                        <MailIcon className='size-4' />
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-[13px] font-semibold text-muted-foreground'>
                            Email Address
                        </p>
                        <Link
                            href={`mailto:${member.user.email}`}
                            className='text-sm hover:underline text-[#1264a3]'
                        >
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
