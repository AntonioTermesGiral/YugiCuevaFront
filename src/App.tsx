import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { Grid } from "@mui/material";
import { BACKGROUND } from "./constants/colors";

function App() {
  return (
    <Grid sx={{ width: "100%", height: "100vh", backgroundColor: BACKGROUND }}>
        <RouterProvider router={router} />
    </Grid>
  )
}

export default App
