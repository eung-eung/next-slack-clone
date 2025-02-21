import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
    id: Id<"members">,
}
type ResponseType = Id<"members"> | null

type Options = {
    onSuccess?: (data: ResponseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: boolean
}

export const useRemoveMember = () => {
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"error" | "success" | "pending" | "settled" | null>(null)

    const isPending = useMemo(() => {
        return status === "pending"

    }, [status])
    const isError = useMemo(() => {
        return status === 'error'
    }, [status])
    const isSettled = useMemo(() => {
        return status === 'settled'
    }, [status])
    const isSuccess = useMemo(() => {
        return status === 'pending'
    }, [status])

    const mutation = useMutation(api.members.remove)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setError(null)
            setStatus('pending')

            const response = await mutation(values)
            options?.onSuccess?.(response)
            return response
        } catch (error) {
            setStatus('error')
            options?.onError?.(error as Error)
            if (options?.throwError) {
                throw error
            }
        } finally {
            setStatus('settled')
            options?.onSettled?.()
        }
    }, [mutation])
    return {
        mutate,
        error,
        isError,
        isPending,
        isSuccess,
        isSettled
    }
}
