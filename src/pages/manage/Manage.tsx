import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../client/useClient";
import { useEffect, useState } from "react";

export const Manage = () => {
    const navigate = useNavigate();
    const { getInstance } = useClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [displayNameError, setDisplayNameError] = useState(false);


    const [isExisting, setIsExisting] = useState(false);

    const handleSetup = async () => {
        setUsernameError(username.trim() === "");
        setPasswordError(password.trim() === "");
        setDisplayNameError(displayName.trim() === "");

        if (username.trim() && password.trim() && displayName.trim()) {
            const supabase = getInstance();

            // User get
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // User update
                const { data: usrUpd, error: usrUpdErr } = await supabase
                    .auth
                    .updateUser({
                        password: password
                    });

                usrUpdErr && console.log(usrUpd, usrUpdErr);
                if (usrUpdErr) {
                    alert("The password must contain at least 6 characters and be different from your old password...")
                    return;
                }

                // Profile update
                const { data: prUpd, error: prUpdErr } = await supabase
                    .from('profile')
                    .upsert([
                        {
                            id: user.id,
                            username: username,
                            display_name: displayName
                        },
                    ])
                    .select()

                prUpdErr && console.log(prUpd, prUpdErr);

                navigate("/");
            } else alert("An unexpected error ocurred: (NoUserData)");
        }
    }

    const handleChangePassword = async () => {
        setPasswordError(password.trim() === "");
        if (password.trim()) {
            const supabase = getInstance();

            // User get
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // User update
                const { data: usrUpd, error: usrUpdErr } = await supabase
                    .auth
                    .updateUser({
                        password: password
                    });

                usrUpdErr && console.log(usrUpd, usrUpdErr);
                if (usrUpdErr) {
                    alert("The password must contain at least 6 characters and be different from your old password...")
                    return;
                }

                navigate("/");
            } else alert("An unexpected error ocurred: (NoUserData)");
        }
    }

    const getIsExistingUser = async () => {
        const supabase = getInstance();

        // User get
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profileUsername, error } = await supabase.from('profile').select('username').eq('id', user.id);
            console.log(profileUsername[0].username, "ERR?", error);
            setIsExisting(profileUsername[0]?.username)
        }
    }

    useEffect(() => {
        getIsExistingUser();
        return;
    }, []);

    return (
        <Grid container height="100%" justifyContent="center" alignItems="center" px={2}>
            <Grid item sx={{ backgroundColor: "lightgray", p: 4, borderRadius: "10px" }}>
                <Grid item>
                    <Typography variant="h4" color="#242424">{isExisting ? "Change your password" : "Complete your setup"}</Typography>
                </Grid>
                {!isExisting && <Grid item my={2}>
                    <TextField
                        fullWidth
                        error={usernameError}
                        variant="standard"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Grid>}
                <Grid item my={2}>
                    <TextField
                        fullWidth
                        error={passwordError}
                        variant="standard"
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Grid>
                {!isExisting && <Grid item mt={2} mb={4}>
                    <TextField
                        fullWidth
                        error={displayNameError}
                        variant="standard"
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </Grid>}
                <Button onClick={isExisting ? handleChangePassword : handleSetup}>
                    Submit
                </Button>
            </Grid>
        </Grid >
    )
}
