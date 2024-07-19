import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { useCheckSession } from './utils/useCheckSession';
import { Grid } from "@mui/material";

function App() {
  useCheckSession();

  return (
    <Grid sx={{ width: "100%", height: "100vh" }}>
      {/* TODO: ADD CHECK ON LAYOUT TO REDIRECT TO LOGIN ON UNLOGGED */}
        <RouterProvider router={router} />
    </Grid>
  )
}

export default App
