import { UserButton } from '@/features/auth/components/user-button'
import { usePathname } from 'next/navigation'
import React from 'react'
import { WorkspaceSwitcher } from './workspace-switcher'
import SideButton from './sidebar-button'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'


export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className='w-[70px] h-full bg-[#481349] flex flex-col items-center gap-y-4 pt-[9px] pb-4'>
            <WorkspaceSwitcher />
            <SideButton icon={Home} label='Home' isActive={pathname.includes('/workspace')} />
            <SideButton icon={MessageSquare} label='DMs' />
            <SideButton icon={Bell} label='Activity' />
            <SideButton icon={MoreHorizontal} label='More' />
            <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
                <UserButton />
            </div>
        </aside>
    )
}
