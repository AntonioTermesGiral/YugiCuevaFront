import { createBrowserRouter, RouteObject } from "react-router-dom";
import "./index.css";
import { Login } from "./pages/login/Login";
import { Profile } from "./pages/profile/Profile";
import { SingleDeck } from "./pages/single-deck/SingleDeck";
import { SingleCard } from "./pages/single-card/SingleCard";
import { TierList } from "./pages/tierlist/TierList";
import { Search } from "./pages/search/Search";
import { Matches } from "./pages/matches/Matches";
import { YGCToolbar } from "./components/layout/Toolbar";
import { WipScreen } from "./components/WipScreen";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Login />,
        id: "login"
    },
    {
        path: "/user/*",
        element: <Profile />
    },
    {
        path: "/tierlists/meta",
        element: <TierList variant="META" />,
    },
    {
        path: "/tierlists/chill",
        element: <TierList variant="CHILL" />,
    },
    {
        path: "/matches",
        element: <Matches />,
    },
    { // TODO: To be implemented
        path: "/polls",
        element: <div>Polls<WipScreen/></div>,
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
];

const addWrapper = (route: RouteObject) => {
    if (route.id != "login") {
        route.element = <YGCToolbar>{route.element as JSX.Element}</YGCToolbar>;
    }
    return route;
}

export const router = createBrowserRouter(routes.map(addWrapper));
