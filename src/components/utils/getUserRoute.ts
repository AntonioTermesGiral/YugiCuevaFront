export const getUserRoute = () => {
    const lsRes = localStorage.getItem("sb-tbdesplqufizydsciqzq-auth-token");
    if (lsRes) {
        const userId = JSON.parse(lsRes).user.id;
        return "/user/?id=" + userId;
    }

    return "/login";
}