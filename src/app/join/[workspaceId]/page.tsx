"use client"
import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"
import { useJoin } from "@/features/workspaces/api/use-join"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Loader } from "lucide-react"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import Image from 'next/image'
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from "sonner"

interface JoinPageProps {
    params: {
        workspaceId: string
    }
}

export default function JoinPage({ params }: JoinPageProps) {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { data, isLoading } = useGetWorkspaceInfo({ workspaceId })
    const { mutate, isPending } = useJoin()
    const [joinCode, setJoinCode] = useState("")
    const [isDisableJoinButton, setIsDisableJoinButton] = useState(true)

    const isMember = useMemo(() => {
        return data?.isMember
    }, [data?.isMember])

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`)
        }
    }, [isMember, router, workspaceId])

    const handleChangeJoinCode = (value: string) => {
        setJoinCode(value)
        if (value.length === 6) {
            setIsDisableJoinButton(false)
        } else {
            setIsDisableJoinButton(true)
        }
    }

    const handleComplete = async (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`)
                toast.success("Workspace joined")
            },
            onError: () => {
                toast.error("Failed to join workspace")
            }
        })
    }
    if (isLoading) return (
        <div className="h-full flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    )
    return (
        <div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8'>
            <Image src='/logo.svg' width={60} height={60} alt='logo' />
            <div className='flex flex-col gap-y-4 items-center justify-center max-w-md'>
                <div className='flex flex-col gap-y-2 items-center justify-center'>
                    <h1 className='text-2xl font-bold'>
                        Join {data?.name}
                    </h1>
                    <p className='text-md text-muted-foreground'>
                        Enter the workspace code to join
                    </p>
                </div>
                <InputOTP
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    maxLength={6} onChange={handleChangeJoinCode}>
                    <InputOTPGroup>
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={0} />
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={1} />
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={2} />
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={3} />
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={4} />
                        <InputOTPSlot className="border-gray-300 uppercase font-bold" index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <div className="flex flex-col gap-y-4">
                    <Button
                        size='lg'
                        variant='default'
                        disabled={isDisableJoinButton || isPending}
                        onClick={() => handleComplete(joinCode)}
                    >
                        Join
                    </Button>
                    <Button
                        size='lg'
                        variant='outline'
                        asChild
                        className="font-bold"
                    >
                        <Link href='/' >Back to home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
