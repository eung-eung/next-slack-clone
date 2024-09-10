import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceInfo {
    workspaceId: Id<'workspaces'>
}

export const useGetWorkspaceInfo = ({ workspaceId }: UseGetWorkspaceInfo) => {
    const data = useQuery(api.workspaces.getInfoById, { workspaceId })
    const isLoading = data === undefined
    return { data, isLoading }
}