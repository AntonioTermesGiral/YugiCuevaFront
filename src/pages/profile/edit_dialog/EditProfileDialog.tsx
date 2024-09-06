import { Button, Dialog, Typography, TextField, Grid, styled } from "@mui/material"
import { useEditProfileDialogVM } from "./useEditProfileDialogVM";

export const EditProfileDialog = () => {
    const {
        editDialogOpen,
        setEditDialogOpen,
        displayName,
        setDisplayName,
        masterDuelRef,
        setMasterDuelRef,
        onChangeProfileImage,
        originalPfpUrl,
        handleUpdateProfile
    } = useEditProfileDialogVM();

    const DeckImageInput = styled('input')({
        clipPath: 'inset(50%)',
        display: 'none'
    });

    return (
        <>
            <Button
                variant="contained"
                color="inherit"
                onClick={() => setEditDialogOpen(true)}
                sx={{
                    width: "50px",
                    height: "50px",
                    position: "absolute",
                    left: { "xs": "auto", "sm": "5em" },
                    right: { "xs": "25%", "sm": "auto" },
                    marginTop: "10px",
                    fontSize: "2em",
                    backgroundColor: "darkgray"
                }}>&#9998;</Button>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} PaperProps={{ sx: { padding: 4 } }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4" my={1}>Profile</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
                            label="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            sx={{ my: 1 }}
                            label="Master Duel ID"
                            value={masterDuelRef}
                            onChange={(e) => setMasterDuelRef(e.target.value)}
                        />
                    </Grid>
                    <Grid item container justifyContent="space-between">
                        <Grid item xs={12} sm={5.5}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                endIcon="↑"
                                sx={{ my: 1 }}
                            >
                                Upload Profile Image
                                <DeckImageInput
                                    type="file"
                                    accept="image/*"
                                    onChange={onChangeProfileImage}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={5.5}>
                            <img
                                id="profile-image-preview"
                                width="200"
                                height="200"
                                src={originalPfpUrl}
                                style={{
                                    backgroundImage: 'url("/images/default-profile.jpg")',
                                    backgroundSize: "cover",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    border: "5px solid black"
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={handleUpdateProfile}>Yes</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}