import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string }
type ResponseType = Id<"workspaces"> | null

type Options = {
    onSuccess?: (data: ResponseType) => void,
    onError?: (error: Error) => void,
    onSettled?: () => void,
    throwError?: boolean
}

export const useCreateWorkspace = () => {
    const [data, setData] = useState<ResponseType>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<"error" | "success" | "pending" | "settled" | null>(null)
    // const [isPending, setIsPending] = useState(false)
    // const [isSuccess, setIsSuccess] = useState(false)
    // const [isError, setIsError] = useState(false)
    // const [isSettled, setIsSettled] = useState(false)
    const isPending = useMemo(() => {
        console.log('calculate isPending');
        console.log('status in isPending: ', status);
        return status === "pending"

    }, [status])
    const isError = useMemo(() => {
        console.log('calculate isError');
        console.log('status in isError: ', status);

        return status === 'error'
    }, [status])
    const isSettled = useMemo(() => {
        console.log('calculate isSettled');
        console.log('status in isSettled: ', status);
        return status === 'settled'
    }, [status])
    const isSuccess = useMemo(() => {
        console.log('calculate isSuccess');
        console.log('status in isSuccess: ', status);
        return status === 'pending'
    }, [status])

    const mutation = useMutation(api.workspaces.create)
    const mutate = useCallback(async (values: RequestType, options?: Options) => {
        try {
            setData(null)
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
        data,
        isError,
        isPending,
        isSuccess,
        isSettled
    }
}
