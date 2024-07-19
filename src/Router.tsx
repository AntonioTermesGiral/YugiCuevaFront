import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import { Login } from "./pages/login/Login";
import { Profile } from "./pages/profile/Profile";
import { SingleDeck } from "./pages/single-deck/SingleDeck";
import { SingleCard } from "./pages/single-card/Card";
import { TierList } from "./pages/tierlist/TierList";
import { Search } from "./pages/search/Search";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/user/*",
        element: <Profile />,
    },
    {
        path: "/tierlists/meta",
        element: <TierList variant="META" />,
    },
    {
        path: "/tierlists/chill",
        element: <TierList variant="CHILL" />,
    },
    { // P2
        path: "/matches",
        element: <div>matches</div>,
    },
    { // P3
        path: "/pools",
        element: <div>pools</div>,
    },
    {
        path: "/search/*",
        element: <Search />,
    },
    {
        path: "/deck/*",
        element: <SingleDeck />,
    },
    {
        path: "/card/*",
        element: <SingleCard />,
    }
]);