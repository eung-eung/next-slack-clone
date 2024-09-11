"use client"

import { useState } from "react"
import { SignInFlow } from "../types"
import { SignInCard } from "./sign-in-card"
import { SignUpCard } from "./sign-up-card"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"

export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>('signIn')
    return (
        <BackgroundBeamsWithCollision
            className="h-full flex items-center justify-center"
        >
            <div className="md:h-auto md:w-[420px] z-20">
                {state === 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
            </div>
        </BackgroundBeamsWithCollision>
    )
}
