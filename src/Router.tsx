import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import { Login } from "./pages/login/Login";
import { Profile } from "./pages/profile/Profile";
import { SingleDeck } from "./pages/single-deck/SingleDeck";
import { SingleCard } from "./pages/single-card/Card";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>,
    },
    {
        path: "/profile",
        element: <Profile/>,
    },
    {
        path: "/user/*",
        element: <div>user</div>,
    },
    {
        path: "/decks",
        element: <div>my decks</div>,
    },
    {
        path: "/tierlists/meta",
        element: <div>tierlist meta</div>,
    },
    {
        path: "/tierlists/chill",
        element: <div>tierlist chill</div>,
    },
    {
        path: "/matches",
        element: <div>matches</div>,
    },
    {
        path: "/pools",
        element: <div>pools</div>,
    },
    {
        path: "/search",
        element: <div>search</div>,
    },
    {
        path: "/deck/*",
        element: <SingleDeck/>,
    },
    {
        path: "/card/*",
        element: <SingleCard />,
    }
]);