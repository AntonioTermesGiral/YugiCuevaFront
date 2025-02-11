import { ChangeEvent, useEffect, useState } from "react";
import { useClient } from "../../../client/useClient";
import Resizer from "react-image-file-resizer";
import { LS_USER_DATA_KEY } from "../../../constants/keys";
import { v4 } from "uuid";

export const useEditProfileDialogVM = () => {
    const { getInstance } = useClient();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [masterDuelRef, setMasterDuelRef] = useState("");
    const [profileImage, setProfileImage] = useState<File>();
    const [userId, setUserId] = useState<string>();
    const [originalPfpUrl, setOriginalPfpUrl] = useState("/images/default-profile.jpg");
    const [currentImageName, setCurrentImageName] = useState<string | null>(null);

    const loadDefaultValues = async () => {
        const supastorage = localStorage.getItem(LS_USER_DATA_KEY);
        if (supastorage) {
            const supabase = getInstance();
            setUserId(JSON.parse(supastorage).user.id);

            // Get user
            const { data: profile, error } = await supabase.from('profile').select().eq('id', JSON.parse(supastorage).user.id);
            error && console.log(error, profile);

            const pfpName = import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + profile[0].image;
            setCurrentImageName(profile[0].image);

            // Sets the values
            pfpName && setOriginalPfpUrl(pfpName);
            setDisplayName(profile[0].display_name);
            setMasterDuelRef(profile[0].master_duel_ref);
        }
    }

    const handleUpdateProfile = async () => {
        const supabase = getInstance();

        const { data, error } = await supabase
            .from('profile')
            .update({ display_name: displayName, master_duel_ref: masterDuelRef })
            .eq('id', userId)
            .select();

        console.log("Display name update: " + data);
        error && console.log("Display name update error: " + error);

        handleUpdateProfileImage().then((success) => {
            if (success) {
                console.log("Import complete");
                location.reload();
            } else {
                if (profileImage) {
                    alert("The profile picture couldn't be updated...");
                } else location.reload();
            }
        })

    }

    const handleUpdateProfileImage = async () => {
        if (profileImage) {
            const imageUUID = v4();
            const imageName = `${imageUUID}.jpeg`;

            const supabase = getInstance();
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('Pfps')
                .upload(imageName, profileImage, {
                    cacheControl: '3600',
                    upsert: true
                });

            console.log("File uploaded: ", uploadData);
            uploadError && console.log("File upload error: ", uploadError);

            const { data: updateData, error: updateError } = await supabase.from("profile")
                .update({ image: imageName })
                .eq("id", userId)
                .select();
            updateError && console.log("Image name update on deck error: ", updateError);
            console.log("Image updated on deck: ", updateData);

            if (currentImageName !== null) {
                const { data: deletionData, error: deletionError } = await supabase
                    .storage
                    .from('Pfps')
                    .remove([currentImageName])

                console.log(currentImageName, deletionData)
                deletionError && console.log("File deletion error: ", deletionError);
            }

            localStorage.setItem("current-user-pfp", import.meta.env.VITE_SUPABASE_PFP_IMG_BUCKET_URL + imageName);

            return !uploadError && !updateError;
        }

        return false;
    }

    const handleResizeProfileImage = (file: File): Promise<File> =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => resolve(uri as File),
                "file"
            );
        });

    const onChangeProfileImage = (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        const imagePreview = document.getElementById('profile-image-preview') as HTMLImageElement;

        if (files && files[0]) {
            console.log(files[0])
            handleResizeProfileImage(files[0]).then((res) => {
                imagePreview.src = URL.createObjectURL(res)
                setProfileImage(res);
            }).catch(() => {
                imagePreview.removeAttribute("src");
                setProfileImage(undefined);
            })
        } else {
            imagePreview.removeAttribute("src");
            setProfileImage(undefined);
        }
    }

    useEffect(() => { loadDefaultValues(); }, []);

    return {
        editDialogOpen,
        setEditDialogOpen,
        displayName,
        setDisplayName,
        masterDuelRef,
        setMasterDuelRef,
        originalPfpUrl,
        onChangeProfileImage,
        handleUpdateProfile
    }

}