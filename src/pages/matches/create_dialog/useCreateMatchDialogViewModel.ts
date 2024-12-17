import { useState } from "react";
import { Tables } from "../../../database.types";
import { useClient } from "../../../client/useClient";

interface IPointModifiers {
    winnerPoints: number,
    loserPoints: number
}

export const useCreatematchDialogViewModel = (refreshData: () => void) => {
    const { getInstance } = useClient();

    const [open, setOpen] = useState(false);
    const [sideDeck, setSideDeck] = useState(false);

    const [deck1, setDeck1] = useState<Tables<"deck"> | null>(null);
    const [winNumber1, setWinNumber1] = useState(0);

    const [deck2, setDeck2] = useState<Tables<"deck"> | null>(null);
    const [winNumber2, setWinNumber2] = useState(0);

    const handleChangeSideDeck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSideDeck(event.target.checked);
    };

    const calcPoints = (winner: Tables<"deck">, loser: Tables<"deck">): IPointModifiers => {
        const winnerTier = winner?.tier;
        const loserTier = loser?.tier;
        if (winnerTier === null || winnerTier === undefined || loserTier === null || loserTier === undefined)
            return { winnerPoints: 0, loserPoints: 0 };

        const tierDifference = Math.abs(winnerTier - loserTier);
        const advantageWin = winnerTier < loserTier;
        if (advantageWin) {
            const tempPoints = 10 - (tierDifference * 3);

            return {
                winnerPoints: tempPoints <= 0 ? 1 : tempPoints,
                loserPoints: tempPoints <= 0 ? -1 : tempPoints * -1
            }
        }

        const tempPoints = 10 + (tierDifference * 5);
        return {
            winnerPoints: tempPoints,
            loserPoints: tempPoints * -1
        }
    }

    const calcTier = (points: number) => {
        const BASE_POINT_DIFF = 50;
        const MIN_POSITIVE_TIER = 6;
        const aproxTier = (points / BASE_POINT_DIFF) - MIN_POSITIVE_TIER;
        const tier = aproxTier >= 0 ? 0 : Math.floor(aproxTier);
        return Math.abs(tier);
    }

    const handleSubmit = async () => {
        // TODO: Not yet implemented
        if (deck1 === null || deck2 === null) {
            alert("Elige dos mazos please");
            return;
        }

        const tie = winNumber1 === winNumber2;

        //#region points & tier calcs
        let points1 = 0;
        let points2 = 0;
        let pointChanges1 = "";
        let pointChanges2 = "";
        if (!tie) {
            const winner = winNumber1 > winNumber2 ? deck1 : deck2;
            const loser = winNumber1 < winNumber2 ? deck1 : deck2;
            const { winnerPoints, loserPoints } = calcPoints(winner, loser);

            if (deck1 === winner) {
                points1 = (deck1.points ?? 0) + winnerPoints;
                pointChanges1 = "+" + winnerPoints.toString();
            } else {
                points1 = (deck1.points ?? 0) + loserPoints;
                pointChanges1 = loserPoints.toString();
            }

            if (deck2 === winner) {
                points2 = (deck2.points ?? 0) + winnerPoints;
                pointChanges2 = "+" + winnerPoints.toString();
            } else {
                points2 = (deck2.points ?? 0) + loserPoints;
                pointChanges2 = loserPoints.toString();
            }
        }

        const newTier1 = calcTier(points1);
        const newTier2 = calcTier(points2);
        //#endregion

        const supabase = getInstance();

        // Match and Match Data creation
        const { data: baseMatchData, error: baseMatchError } = await supabase.from("match").insert({
            type: "1VS1",
            side_deck: sideDeck
        } as Tables<"match">).select();

        baseMatchError && console.log("MATRCH ERR: ", baseMatchError);

        const { error: player1MatchError } = await supabase.from("match_data").insert({
            deck: deck1.id,
            player: deck1.owner,
            score: winNumber1 ?? 0,
            match_id: baseMatchData[0].id,
            winner: tie ? null : winNumber1 > winNumber2,
            deck_point_changes: pointChanges1
        } as Tables<"match_data">);

        player1MatchError && console.log("MATRCH ERR: ", player1MatchError);

        const { error: player2MatchError } = await supabase.from("match_data").insert({
            deck: deck2.id,
            player: deck2.owner,
            score: winNumber2 ?? 0,
            match_id: baseMatchData[0].id,
            winner: tie ? null : winNumber2 > winNumber1,
            deck_point_changes: pointChanges2
        } as Tables<"match_data">);

        player2MatchError && console.log("MATRCH ERR: ", player2MatchError);

        // Points & Tier update
        const { error: deck1UpdateError } = await supabase
            .from('deck')
            .update({
                points: points1,
                tier: newTier1
            } as Tables<"deck">)
            .eq('id', deck1.id)

        deck1UpdateError && console.log("DECK ERR: ", deck1UpdateError);

        const { error: deck2UpdateError } = await supabase
            .from('deck')
            .update({
                points: points2,
                tier: newTier2,
            } as Tables<"deck">)
            .eq('id', deck2.id)

        deck2UpdateError && console.log("DECK ERR: ", deck2UpdateError);

        // TODO: Tier change message (card o dialog?)

        refreshData();

        setSideDeck(false);
        setDeck1(null);
        setWinNumber1(0);
        setDeck2(null);
        setWinNumber2(0);

        setOpen(false);
    }

    return {
        open,
        setOpen,
        sideDeck,
        deck1,
        setDeck1,
        setWinNumber1,
        deck2,
        setDeck2,
        setWinNumber2,
        handleChangeSideDeck,
        handleSubmit
    }
}