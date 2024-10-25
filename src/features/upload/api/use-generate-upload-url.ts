import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";


type ResponseType = string | null

type Options = {
    onSuccess?: (data: ResponseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: boolean
}

export const useGenerateUploadUrl = () => {
    const [data, setData] = useState<ResponseType>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"error" | "success" | "pending" | "settled" | null>(null)
    // const [isPending, setIsPending] = useState(false)
    // const [isSuccess, setIsSuccess] = useState(false)
    // const [isError, setIsError] = useState(false)
    // const [isSettled, setIsSettled] = useState(false)
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

    const mutation = useMutation(api.upload.generateUploadUrl)
    const mutate = useCallback(async (_values: {}, options?: Options) => {
        try {
            setData(null)
            setError(null)
            setStatus('pending')

            const response = await mutation()
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
        data,
        isError,
        isPending,
        isSuccess,
        isSettled
    }
}
