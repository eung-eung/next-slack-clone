import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";

interface UseGetMembersProps {
    id: Id<"members">
}

export const useGetMember = ({ id }: UseGetMembersProps) => {

    try {
        // first render, useQuery will query db, this time data = undefined
        //convex response data => rerender and update data
        const data = useQuery(api.members.getById, { id })
        const isLoading = data === undefined
        return { data, isLoading }
    } catch (error) {
        console.log(error);
        return { data: null, isLoading: false }
    }


}