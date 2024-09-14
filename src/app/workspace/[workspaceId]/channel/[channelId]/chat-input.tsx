import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef } from "react"

// Editor should not be in severside rendering => ssr:false
//dynamic: will render later, not in serverside rendering
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface ChatInputProps {
    placeholder: string,

}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null)
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const { mutate: createMessage, isPending } = useCreateMessage()

    const handleSubmit = ({
        body,
        image
    }: {
        body: string,
        image: File | null
    }) => {
        console.log({ body, image });
        createMessage({
            workspaceId,
            channelId,
            body
        })
        editorRef.current?.setContents([])
    }
    return (
        <div className="px-5 w-full">
            <Editor
                variant="create"
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    )
}