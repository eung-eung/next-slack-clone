import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
    workspaceId: Id<"workspaces">,
    memberId: Id<"members">
}
type ResponseType = Doc<"conversations"> | null

type Options = {
    onSuccess?: (data: ResponseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: boolean
}

export const useCreateOrGerConversation = () => {
    const [data, setData] = useState<ResponseType>(null)
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

    const mutation = useMutation(api.conversation.createOrGet)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null)
            setError(null)
            setStatus('pending')

            const response = await mutation(values)
            options?.onSuccess?.(response)
            setData(response)
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
        data,
        isError,
        isPending,
        isSuccess,
        isSettled
    }
}
