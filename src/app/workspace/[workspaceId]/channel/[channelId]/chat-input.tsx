import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import dynamic from "next/dynamic"
import Quill from "quill"
import { Suspense, useRef, useState } from "react"
import { toast } from "sonner"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"

// import Editor from "@/components/editor"

// Editor should not be in severside rendering => ssr:false
//dynamic: will render later, not in serverside rendering
const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
    loading: () => <>
        <Skeleton className="w-full h-[20px] mb-1" />
        <Skeleton className="w-full h-[50px] mb-1" />
        <Skeleton className="w-full h-[20px] mb-1" />
    </>
})

interface ChatInputProps {
    placeholder: string,

}
type CreateMessageValues = {
    channelId: Id<"channels">,
    workspaceId: Id<"workspaces">,
    body: string,
    image: Id<"_storage"> | undefined
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null)
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const [isPending, setIsPending] = useState(false)
    const [image, setImage] = useState<File | null>(null)
    const { mutate: createMessage } = useCreateMessage()
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const handleSubmit = async ({
        body,
        image
    }: {
        body: string,
        image: File | null
    }) => {
        try {
            setIsPending(true)
            editorRef.current?.enable(false)

            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                body,
                image: undefined
            }

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true })

                if (!url) {
                    throw new Error("Url not found")
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type
                    },
                    body: image
                })
                if (!result.ok) {
                    throw new Error("Failed to upload image")
                }
                const { storageId } = await result.json()

                values.image = storageId
                setImage(null)
            }

            await createMessage(values, { throwError: true })
            editorRef.current?.setContents([])

        } catch (error) {
            toast.error("Failed to send message")
        } finally {
            setIsPending(false)
            editorRef.current?.enable(true)
        }
    }
    return (
        <div className="px-5 w-full">
            <Editor
                setImage={setImage}
                image={image}
                variant="create"
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}