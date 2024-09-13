import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { Grid } from "@mui/material";

function App() {
  return (
    <Grid sx={{ width: "100%", height: "100vh", backgroundColor: "#242424" }}>
      {/* TODO: ADD CHECK ON LAYOUT TO REDIRECT TO LOGIN ON UNLOGGED */}
        <RouterProvider router={router} />
    </Grid>
  )
}

export default App
