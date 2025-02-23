import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useChannelId } from '@/hooks/use-channel-id'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'

import React from 'react'
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react'
import { WorkspaceSection } from './workspace-section'
import WorkspaceHeader from './workspace-header'
import SidebarItem from './sidebar-item'
import UserItem from './user-item'
import { useMemberId } from '@/hooks/use-member-id'

export default function WorkspaceSidebar() {
    const memberId = useMemberId()
    const workspaceId = useWorkspaceId()
    const [_open, setOpen] = useCreateChannelModal()
    const channelId = useChannelId()

    // get current member in a workspace
    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
    // get data a workspace
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: channels, isLoading: channelLoading } = useGetChannels({ workspaceId })
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })

    if (workspaceLoading || memberLoading) {
        return <div className='flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
            <Loader className='size-5 animate-spin text-white' />
        </div>
    }

    if (!member || !workspace) {
        return <div className='flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center'>
            <AlertTriangle className='size-5 text-white' />
            <p className='text-white text-xs'>
                Workspace not found
            </p>
        </div>
    }
    return (
        <div className='flex flex-col bg-[#5E2C5F] h-full'>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === 'admin'} />
            <div className='flex flex-col px-2 mt-3'>
                <SidebarItem
                    label='Threads'
                    icon={MessageSquareText}
                    id="threads"
                />
                <SidebarItem
                    label='Drafts & Sent'
                    icon={SendHorizonal}
                    id="drafts"
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New channels"
                onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        key={item._id}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Messages"
                hint="Direct Messages"
                onNew={() => { }}
            >
                {members?.map((item) => (
                    <UserItem
                        key={item._id}
                        id={item._id}
                        label={item.user.name}
                        image={item.user.image}
                        variant={item._id === memberId ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>

        </div>
    )
}
