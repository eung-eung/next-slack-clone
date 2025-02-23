import { Delta, Op } from "quill/core"
import Quill, { QuillOptions } from "quill"
import { memo, MutableRefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { MdSend } from "react-icons/md"
import { Button } from "./ui/button"
import { PiTextAa } from "react-icons/pi"
import { ImageIcon, Smile, XIcon } from "lucide-react"
import { Hint } from "./hint"

import 'quill/dist/quill.snow.css'
import { cn } from "@/lib/utils"
import { EmojiPopover } from "./emoji-popover"
import Image from "next/image"


type EditorValue = {
    image: File | null,
    body: string
}
interface ImageEditorProps {
    image: File | null,
    handleRemoveImage: () => void
}
interface EditorProps {
    variant?: "create" | "update",
    onSubmit: ({ image, body }: EditorValue) => void,
    onCancel?: () => void,
    defaultValue?: Delta | Op[],
    placeholder?: string,
    disabled?: boolean,
    innerRef?: MutableRefObject<Quill | null>,
    image?: File | null,
    setImage?: React.SetStateAction<any>,
    // imageElementRef: any
}

const Editor = ({
    variant = "create",
    defaultValue = [],
    disabled,
    innerRef,
    onCancel,
    onSubmit,
    placeholder = "Write something...",
    image,
    setImage,
    // imageElementRef
}: EditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const submitRef = useRef(onSubmit)
    const imageElementRef = useRef<HTMLInputElement>(null)

    const [text, setText] = useState("")

    const [isToolbarVisible, setIsToolbarVisible] = useState(true)
    console.log('image', image);

    useLayoutEffect(() => {
        console.log("layouteffect");

        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        disabledRef.current = disabled
    }, [])

    useEffect(() => {
        if (!containerRef.current) return
        console.log("use effect");

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
                                const text = quill.getText()
                                const addedImage = imageElementRef.current?.files?.[0] || null

                                // no add image and no type any letter
                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0
                                if (isEmpty) return

                                const body = JSON.stringify(quill.getContents())

                                submitRef.current?.({
                                    body, image: addedImage
                                })
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

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current

        quill?.insertText(quill.getSelection()?.index || 0, emoji.native)
    }


    const handleRemoveImage = useCallback(() => {
        setImage(null)
        imageElementRef.current!.value = ""
    }, [])


    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(event) => setImage(event.target.files![0])}
                className="hidden"
            />
            <div className={cn("flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
                disabled && "opacity-50"
            )}>
                <div ref={containerRef} className="h-full ql-custom" />
                {
                    image &&
                    <ImageEditor
                        image={image}
                        handleRemoveImage={handleRemoveImage}
                    />
                }

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
                    <EmojiPopover
                        onEmojiSelect={onEmojiSelect}
                        hint="Emoji">
                        <Button
                            disabled={disabled}
                            size="iconSm"
                            variant="ghost"
                            onClick={() => { }}
                        >
                            <Smile className="size-4" />
                        </Button>
                    </EmojiPopover>
                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={disabled || isEmpty}
                                onClick={() => {
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image: image || null
                                    })
                                }}
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
                                onClick={() => imageElementRef.current?.click()}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    }

                    {
                        variant == "create" && <Button
                            onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image: image || null
                                })
                            }}
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
            {
                variant === 'create'
                && (
                    <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                        !isEmpty && "opacity-100"
                    )}>
                        <p>
                            <strong>Shift + Return</strong> to add a new line
                        </p>
                    </div>
                )
            }

        </div>
    )
}

export default Editor

const ImageEditor = memo(
    ({ image, handleRemoveImage }: ImageEditorProps) =>
    (
        !!image &&
        <>
            <div className="p-2">
                <div className="relative size-[62px] flex items-center justify-center group/image">
                    <Hint
                        label="Remove image"
                    >
                        <button
                            onClick={handleRemoveImage}
                            className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-bl absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white justify-center items-center"
                        >
                            <XIcon className="size-3.5" />
                        </button>
                    </Hint>
                    <Image
                        src={URL.createObjectURL(image)}
                        alt="Uploaded"
                        fill
                        className="rounded-xl overflow-hidden border object-cover"
                    />
                </div>
            </div>
        </>

    )
)
ImageEditor.displayName = "ImageEditor"