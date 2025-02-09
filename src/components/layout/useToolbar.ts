import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useToolbar = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [pfpUrl, setPfpUrl] = useState("/images/default-profile.jpg");

    const handleSearchSubmit = () => {
        if (searchBarValue.trim() != "") {
            setSearchBarValue("");
            setTimeout(() => setIsDrawerOpen(false))
            navigate("/search/?q=" + searchBarValue);
        }
    }

    const handleNavigate = (route: string) => {
        setIsDrawerOpen(false);
        navigate(route);
    }

    const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchBarValue(e.target.value)
    }

    const openDrawer = () => setIsDrawerOpen(true)
    const closeDrawer = () => setIsDrawerOpen(false)

    useEffect(() => {
        const userPFP = localStorage.getItem('current-user-pfp');
        userPFP && setPfpUrl(userPFP);
    }, [])

    return {
        isDrawerOpen,
        searchBarValue,
        pfpUrl,
        handleSearchSubmit,
        handleNavigate,
        onChangeSearchValue,
        openDrawer,
        closeDrawer
    }
}