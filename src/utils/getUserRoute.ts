import { LS_USER_DATA_KEY } from "../constants/keys";

export const getUserRoute = () => {
    const lsRes = localStorage.getItem(LS_USER_DATA_KEY);
    if (lsRes) {
        const userId = JSON.parse(lsRes).user.id;
        return "/user/?id=" + userId;
    }

    return "/login";
}