
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../api/use-current-user"
import { Loader, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export const UserButton = () => {
    const { data, isLoading } = useCurrentUser()
    const { signOut } = useAuthActions()
    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }

    if (!data) {
        return null
    }

    const { name, email, image } = data

    // name! : name is exist and it will not cause
    const avatarFallback = name!.charAt(0).toUpperCase()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage alt={name} src={image} />
                    <AvatarFallback className="bg-sky-500 text-white">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={() => signOut()} className="-10">
                    <LogOut className="size-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}