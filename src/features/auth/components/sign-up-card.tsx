'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@radix-ui/react-separator"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { TriangleAlert } from "lucide-react"
import { SignInFlow } from "../types"
import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
interface SignUpCardProps {
    setState: (state: SignInFlow) => void
}
export const SignUpCard = ({ setState }: SignUpCardProps) => {
    const { signIn } = useAuthActions();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [pending, setPending] = useState(false)

    //signUp credentials email+pasword
    const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError('Password does not match')
            return
        }
        setPending(true)
        signIn("password", { name, email, password, flow: "signUp" })
            .catch(() => {
                setError("Something went wrong")
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

    return <Card className="w-full h-full p-8">
        <CardHeader className="px-0 pt-0">
            <CardTitle>
                <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                    <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className="text-lg">Sign up to continue</span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
                        <span className="text-lg">Sign up to continue</span>
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
            <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                <Input
                    disabled={pending}
                    value={name}
                    onChange={(ev) => { setName(ev.target.value) }}
                    placeholder="Full name"
                    required
                />
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
                <Input
                    disabled={pending}
                    value={confirmPassword}
                    onChange={(ev) => { setConfirmPassword(ev.target.value) }}
                    placeholder="Confirm password"
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
                Already have an account? <span onClick={() => setState('signIn')} className="text-sky-700 hover:underline cursor-pointer">Sign in</span>
            </p>
        </CardContent>
    </Card>
}