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
                localStorage.clear();
                navigate("/");
            }
        } else {
            localStorage.clear();
            navigate("/");
        }
    }, [loc.pathname, loc.search, loc.key]);
}

export const useCheckNoSession = () => {
    const navigate = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        const userDataText = localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token');

        if (userDataText) {
            const userData = JSON.parse(userDataText);
            if (userData.expires_at && userData.expires_at > Math.round(Date.now() / 1000)) {
                const userId = userData.user.id;
                if (userId) navigate("/user/?id=" + userId);
                else localStorage.clear();
            }
        }
    }, [loc.pathname, loc.key]);
}
