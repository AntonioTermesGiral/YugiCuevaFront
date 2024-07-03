import { useEffect } from "react";

export const SingleDeck = () => {

    useEffect(() => {
        const url = new URL(location.href);
        const deckID = url.searchParams.get("id");
        console.log("DECK ID: ", deckID);
    }, []);

    return (
        <div>single deck</div>
    );
};
