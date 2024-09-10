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

    return (
        <div className="px-5 w-full">
            <Editor
                variant="create"
                placeholder={placeholder}
                onSubmit={() => { }}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    )
}