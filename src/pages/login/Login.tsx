import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useClient } from "../../client/useClient";



export const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async () => {
        const {getInstance} = useClient();
        const supabase = getInstance();

        const { data: user, error: userErr } = await supabase.auth.signInWithPassword({
            email: import.meta.env.VITE_TEST_USER_EMAIL,
            password: import.meta.env.VITE_TEST_USER_PASSWORD,
        });

        console.log(user, userErr);

        let { data, error } = await supabase.from('card').select();
        console.log(error);
        return data;
    }

    return (
        <Grid container>
            Login
            <Button onClick={() => {
                handleLogin().then(() => navigate("/profile"));
            }}>
                Submit Test
            </Button>
        </Grid>
    )
}