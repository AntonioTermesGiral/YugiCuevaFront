import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import { useCheckSession } from './utils/useCheckSession';
import { Grid } from "@mui/material";

function App() {
  useCheckSession();

  return (
    <Grid container>
      <RouterProvider router={router} />
    </Grid>
  )
}

export default App
