"use client"

import { useGetChannel } from "@/features/channels/api/use-get-channel"
import { useChannelId } from "@/hooks/use-channel-id"
import { Loader, TriangleAlert } from "lucide-react"
import { Header } from "./header"
import { ChatInput } from "./chat-input"


export default function ChannelIdPage() {
    const channelId = useChannelId()
    const { data: channel, isLoading: channelLoading } = useGetChannel({ channelId })

    if (channelLoading) {
        return (<div className="h-full flex-1 flex items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>)
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">
                    Channel not found
                </span>
            </div>
        )
    }
    return (
        <div className="flex flex-col h-full">
            <Header title={channel.name} />
            <div className="flex-1" />
            <ChatInput />
        </div>
    )
}
