import { useEffect } from "react"
import { LS_USER_DATA_KEY } from "../constants/keys";
import { useClient } from "../client/useClient";

export const useLoadPFP = () => {
    const { getInstance } = useClient();

    const handleLoadPfp = async (userId: string) => {
        const supabase = getInstance();

        const { data: userData, error: userErr } = await supabase.from("profile")
            .select("image").eq("id", userId).limit(1).single();

        userErr && console.log(userErr);
        return userData.image;
    }

    useEffect(() => {
        const userDataText = localStorage.getItem(LS_USER_DATA_KEY);

        if (!localStorage.getItem('current-user-pfp') && userDataText) {
            const userData = JSON.parse(userDataText);
            if (userData.expires_at && userData.user.id && userData.expires_at > Math.round(Date.now() / 1000)) {
                handleLoadPfp(userData.user.id).then((pfpName) => {
                    localStorage.setItem("current-user-pfp", import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + pfpName);
                })

            } else localStorage.removeItem("current-user-pfp");
        }
    }, []);
}