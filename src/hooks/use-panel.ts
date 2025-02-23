import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";
import { useProfileMemberId } from "@/features/messages/store/use-profile-member-id";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId()
    const [profileMemberId, setProfileMemberId] = useProfileMemberId()


    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId)
        setParentMessageId(null)
    }

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId)
        setProfileMemberId(null)
    }

    const onClose = () => {
        setProfileMemberId(null)
        setParentMessageId(null)
    }

    return {
        profileMemberId,
        onOpenProfile,
        parentMessageId,
        onOpenMessage,
        onClose
    }
}