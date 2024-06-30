import { useEffect } from "react"

export const useCheckSession = () => {
    useEffect(() => {
        // console.log("initial: ", localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token'));
    }, []);

    useEffect(() => {
        // console.log("modified: " + localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token'));
    }, [localStorage, localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token')]);
}