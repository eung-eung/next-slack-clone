import { Delta, Op } from "quill/core"
import Quill, { QuillOptions } from "quill"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import { MdSend } from "react-icons/md"
import { Button } from "./ui/button"
import { PiTextAa } from "react-icons/pi"
import { ImageIcon, Smile } from "lucide-react"
import { Hint } from "./hint"

import 'quill/dist/quill.snow.css'
import { cn } from "@/lib/utils"

type EditorValue = {
    image: File | null,
    body: string
}

interface EditorProps {
    variant?: "create" | "update",
    onSubmit?: ({ image, body }: EditorValue) => void,
    onCancel?: () => void,
    defaultValue?: Delta | Op[],
    placeholder?: string,
    disabled?: boolean,
    innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({
    variant = "create",
    defaultValue = [],
    disabled,
    innerRef,
    onCancel,
    onSubmit,
    placeholder = "Write something..."
}: EditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const submitRef = useRef(onSubmit)

    const [text, setText] = useState("")
    const [isToolbarVisible, setIsToolbarVisible] = useState(true)
    useLayoutEffect(() => {
        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        disabledRef.current = disabled
    })

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        )
        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                //TODO SUbmit form
                                return
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                            }
                        }
                    }
                }
            }
        }

        const quill = new Quill(editorContainer, options)
        quillRef.current = quill
        quillRef.current.focus()

        if (innerRef) {
            innerRef.current = quill
        }

        quill.setContents(defaultValueRef.current)
        setText(quill.getText())

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText())
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if (container) {
                container.innerHTML = ""
            }
            if (quillRef.current) {
                quillRef.current = null
            }
            if (innerRef) {
                innerRef.current = null
            }
        }
    }, [])

    // remove html tag and check: <p></p> => is also empty but need use replace
    // without replace: <p></p>: is empty but it will be not empty
    // \n: will be empty if using .replace regex
    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0

    const toggleToolbarVisible = () => {
        setIsToolbarVisible((current) => !current)
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar")

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden")
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref={containerRef} className="h-full ql-custom" />
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={toggleToolbarVisible}
                        >
                            <PiTextAa
                                className="size-4" />
                        </Button>
                    </Hint>
                    <Hint label="Emoji">
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={() => { }}
                        >
                            <Smile className="size-4" />
                        </Button>
                    </Hint>
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => { }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={disabled || isEmpty}
                                onClick={() => { }}
                                className="bg-[#007a58] hover:bg-[#007a58]/80 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    )
                    }
                    {
                        variant === "create" && <Hint label="Image">
                            <Button
                                disabled={false}
                                size="iconSm"
                                variant="ghost"
                                onClick={() => { }}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    }

                    {
                        variant == "create" && <Button
                            onClick={() => { }}
                            disabled={isEmpty || disabled}
                            size="iconSm"
                            className={cn("ml-auto",
                                isEmpty
                                    ? "bg-white hover:bg-white/80 text-muted-foreground"
                                    : "bg-[#007a58] hover:bg-[#007a58]/80 text-white"

                            )}>
                            <MdSend className="size-4" />
                        </Button>
                    }
                </div>
            </div>
            <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                <p>
                    <strong>Shift + Return</strong> to add a new line
                </p>
            </div>
        </div>
    )
}

export default Editor