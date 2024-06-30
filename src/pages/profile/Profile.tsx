import { Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useClient } from "../../client/useClient";
import { ImportDeckDialog } from "./import_dialog/ImportDeckDialog";

export const Profile = () => {

    const { getInstance } = useClient();
    const [userName, setUserName] = useState("");
   

    const getUserData = async () => {

        const supastorage = localStorage.getItem('sb-tbdesplqufizydsciqzq-auth-token');
        if (supastorage) {
            const supabase = getInstance();
            let { data: profile, error } = await supabase.from('profile').select("*").eq('id', JSON.parse(supastorage).user.id);
            console.log(error, profile);
            return profile;
        }
        return undefined;
    }


    useEffect(() => {
        getUserData().then((res) => {
            setUserName(res[0].display_name ?? "?");
        })
    }, [])

    return (
        <Grid container direction='column'>
            <Typography>{userName}</Typography>
            <Typography>My profile</Typography>
            <ImportDeckDialog/>
        </Grid>
    )
}