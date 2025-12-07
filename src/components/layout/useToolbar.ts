import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PFP_URL = "/images/default-profile.jpg";

export const useToolbar = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [pfpUrl, setPfpUrl] = useState(DEFAULT_PFP_URL);

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

    const handleImageLoad = () => {
        if (pfpUrl === DEFAULT_PFP_URL) {
            const userPFP = localStorage.getItem('current-user-pfp');
            userPFP && setPfpUrl(userPFP + "?ver=" + new Date().getTime());

            if (userPFP === null)
                setTimeout(handleImageLoad, 100);
        }
    }

    useEffect(handleImageLoad, [])

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