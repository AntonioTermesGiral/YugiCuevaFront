import { Button, Grid, SxProps, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../client/useClient";
import { KeyboardEvent, useState } from "react";
import { useCheckNoSession } from "../../utils/useCheckSession";

export const Login = () => {
    const navigate = useNavigate();
    const { getInstance } = useClient();
    useCheckNoSession();

    const theme = useTheme();
    const { loginContainer, loginCard, sideImage } = loginStyles();
    const showImage = useMediaQuery(theme.breakpoints.up("md"));

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const getEmailByUsername = async (): Promise<string | null> => {
        const supabase = getInstance();
        const { data, error } = await supabase.rpc('get_email_by_username', { name: user });
        error && console.log(data, error);
        return data;
    }

    // TODO: login w/username
    const handleLogin = async () => {
        const supabase = getInstance();
        localStorage.clear();
        const searchedEmail = await getEmailByUsername();

        const { data: userData, error: userErr } = await supabase.auth.signInWithPassword({
            email: searchedEmail ?? user,
            password: pass
        });

        console.log(userData, userErr);
        return userData;
    }

    const handleEnter = (ev: KeyboardEvent) => {
        if (ev.key == "Enter") {
            handleLogin().then((res) => navigate("/user/?id=" + res.user?.id));
        }
    }

    return (
        <Grid container sx={{ ...loginContainer, justifyContent: showImage ? "space-between" : "center" }}>
            {showImage && <Grid item md={6} sx={sideImage} />}
            <Grid item container md={6} sx={{ justifyContent: "center" }}>
                <Grid item sx={loginCard} rowSpacing={2} onKeyDown={handleEnter}>
                    <Grid item>
                        <Typography variant="h4">Login</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard" label="Email" value={user} onChange={(e) => { setUser(e.target.value) }} />
                    </Grid>
                    <Grid item marginBottom="1rem">
                        <TextField variant="standard" type="password" label="Contraseña" value={pass} onChange={(e) => { setPass(e.target.value) }} />
                    </Grid>
                    <Button onClick={() => {
                        handleLogin().then((res) => navigate("/user/?id=" + res.user?.id));
                    }}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Grid >
    )
}

const loginStyles = () => {
    const loginContainer: SxProps<Theme> = {
        height: "100vh",
        alignItems: "center"
    }

    const loginCard: SxProps<Theme> = {
        backgroundColor: "whitesmoke",
        borderRadius: "5%",
        marginX: "3rem",
        padding: "4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "black"
    }

    const sideImage: SxProps<Theme> = {
        backgroundImage: 'url("/images/login-background.jpg")',
        height: "100%",
        filter: "blur(2px)",
        backgroundPosition: "top"
    }

    return {
        loginContainer,
        loginCard,
        sideImage
    }
}