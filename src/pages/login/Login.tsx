import { Button, Grid, SxProps, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../client/useClient";
import { useState } from "react";

export const Login = () => {
    const navigate = useNavigate();

    const theme = useTheme();
    const { loginContainer, loginCard, sideImage } = loginStyles();
    const showImage = useMediaQuery(theme.breakpoints.up("md"));

    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    // TODO: login w/username
    const handleLogin = async () => {
        const { getInstance } = useClient();
        const supabase = getInstance();

        const { data: user, error: userErr } = await supabase.auth.signInWithPassword({
            email: import.meta.env.VITE_TEST_USER_EMAIL,
            password: import.meta.env.VITE_TEST_USER_PASSWORD,
        });

        console.log(user, userErr);
        return user;
    }

    return (
        <Grid container sx={{ ...loginContainer, justifyContent: showImage ? "space-between" : "center" }}>
            {showImage && <Grid item md={6} sx={sideImage} />}
            <Grid item container md={6} sx={{ justifyContent: "center" }}>
                <Grid item sx={loginCard} rowSpacing={2}>
                    <Grid item>
                        <Typography variant="h4">Login</Typography>
                    </Grid>
                    <Grid item>
                        <TextField variant="standard" label="Email" value={user} onChange={(e) => { setUser(e.target.value) }} />
                    </Grid>
                    <Grid item marginBottom="1rem">
                        <TextField variant="standard" type="password" label="Contraseña" value={pass} onChange={(e) => { setPass(e.target.value) }} />
                    </Grid>
                    <Grid item>
                        <Button onClick={() => {
                            handleLogin().then((res) => navigate("/user/?id=" + res.user?.id ));
                        }}>
                            Submit
                        </Button>
                    </Grid>
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