'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-separator"
import { TriangleAlert } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SignInFlow } from "../types"
import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react";
interface SignInCardProps {
    setState: (state: SignInFlow) => void
}
export const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [pending, setPending] = useState(false)


    //signIn credentials email+pasword
    const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)
        signIn("password", { email, password, flow: "signIn" })
            .catch(() => {
                setError("Invalid email or password")
            })
            .finally(() => {
                setPending(false)
            })
    }

    //signIn depend provider value github/google
    const onProviderSignIn = (value: "github" | "google") => {
        setPending(true)
        signIn(value)
            .finally(() => {
                setPending(false)
            })
    }

    return <Card className="w-full h-full p-8 border-2">
        <CardHeader className="px-0 pt-0">
            <CardTitle>
                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className="text-lg">Login to continue</span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                        <span className="text-lg">Login to continue</span>
                    </div>
                </div>
            </CardTitle>
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
        </CardHeader>
        {!!error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                <TriangleAlert className="size-4" />
                <p>{error}</p>
            </div>
        )}
        <CardContent className="space-y-5 px-0 pb-0">
            <form onSubmit={onPasswordSignIn} className="space-y-2.5">
                <Input
                    disabled={pending}
                    value={email}
                    onChange={(ev) => { setEmail(ev.target.value) }}
                    placeholder="Email"
                    type="email"
                    required
                />
                <Input
                    disabled={pending}
                    value={password}
                    onChange={(ev) => { setPassword(ev.target.value) }}
                    placeholder="Password"
                    type="password"
                    required
                />
                <Button type="submit" className="w-full" size='lg' disabled={pending}>
                    Continue
                </Button>
            </form>
            <Separator />
            <div className="flex flex-col gap-y-2.5">
                <Button
                    disabled={pending}
                    onClick={() => { onProviderSignIn('google') }}
                    variant='outline'
                    size='lg'
                    className="w-full relative"
                >
                    <FcGoogle className="size-5 absolute top-3 left-3" />
                    Continue with Google
                </Button>
                <Button
                    disabled={pending}
                    onClick={() => { onProviderSignIn('github') }}
                    variant='outline'
                    size='lg'
                    className="w-full relative"
                >
                    <FaGithub className="size-5 absolute top-3 left-3" />
                    Continue with Github
                </Button>
            </div>
            <p className="text-xs  text-muted-foreground">
                Don&apos;t have an account? <span onClick={() => setState('signUp')} className="text-sky-700 hover:underline cursor-pointer">Sign up</span>
            </p>
        </CardContent>
    </Card>
}