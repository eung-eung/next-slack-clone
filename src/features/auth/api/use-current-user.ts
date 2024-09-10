import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useCurrentUser = () => {
    // data can be undefined or null when waiting query => set isLoading
    const data = useQuery(api.user.current)
    const isLoading = data === undefined

    return { isLoading, data }
}