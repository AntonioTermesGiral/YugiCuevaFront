import { useEffect } from "react"
import { LS_USER_DATA_KEY } from "../constants/keys";

export const useLoadPFP = () => {

    useEffect(() => {
        const userDataText = localStorage.getItem(LS_USER_DATA_KEY);

        if (!localStorage.getItem('current-user-pfp') && userDataText) {
            const userData = JSON.parse(userDataText);
            if (userData.expires_at && userData.user.id && userData.expires_at > Math.round(Date.now() / 1000)) {
                const pfpURL = import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + userData.user.id + import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_EXT;
                localStorage.setItem("current-user-pfp", pfpURL);
            } else localStorage.removeItem("current-user-pfp");
        }
    }, []);
}