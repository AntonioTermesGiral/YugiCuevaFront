import { useEffect } from "react"
import { useClient } from "../client/useClient";

export const useLoadPFP = () => {
    const { getInstance } = useClient();

    const getUserAvatarById = async (id: string) => {
        const supabase = getInstance();
        let { data: pfpName, error: pfpNameError } = await supabase.rpc('get_avatar_by_user_id', { user_id: id });
        pfpNameError && console.log(pfpName, pfpNameError);
        return pfpName;
    }

    useEffect(() => {
        const userDataText = localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token');

        if (!localStorage.getItem('current-user-pfp') && userDataText) {
            const userData = JSON.parse(userDataText);
            if (userData.expires_at && userData.user.id && userData.expires_at > Math.round(Date.now() / 1000)) {
                getUserAvatarById(userData.user.id).then((res) => {
                    localStorage.setItem("current-user-pfp", res ? import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + res : "/images/default-profile.jpg");
                })
            } else localStorage.removeItem("current-user-pfp");
        }
    }, []);
}