import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";

export const useCheckSession = () => {
    const navigate = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        const userDataText = localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token');

        if (userDataText) {
            const userData = JSON.parse(userDataText);
            if (!userData.expires_at || (userData.expires_at && userData.expires_at <= Math.round(Date.now() / 1000))) {
                navigate("/");
            }
        } else navigate("/");
    }, [loc.pathname, loc.search, loc.key]);
}