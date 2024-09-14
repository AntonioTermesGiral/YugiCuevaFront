import { ChangeEvent, useEffect, useState } from "react";
import { useClient } from "../../../client/useClient";
import Resizer from "react-image-file-resizer";

export const useEditDeckDialogVM = () => {
    const { getInstance } = useClient();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deckImage, setDeckImage] = useState<File>();
    const [deckId, setDeckId] = useState<string>();
    const [deckName, setDeckName] = useState("");
    const [originalDeckPictureUrl, setOriginalDeckPictureUrl] = useState("/images/default-profile.jpg");

    const loadDefaultValues = async () => {
        const supabase = getInstance();
        const currentDeckId = new URL(location.href).searchParams.get('id')
        if (currentDeckId) {
            setDeckId(currentDeckId);

            // Get deck
            const { data: deckData, error } = await supabase.from('deck').select().eq('id', currentDeckId);
            error && console.log(error, deckData);

            const currentDeckPic = import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_URL + currentDeckId + import.meta.env.VITE_SUPABASE_DECK_IMG_BUCKET_EXT + "?ver=" + new Date().getTime();

            // Sets the values
            currentDeckPic && setOriginalDeckPictureUrl(currentDeckPic);
            setDeckName(deckData[0].name);
        }
    }

    const handleUpdateDeck = async () => {
        const supabase = getInstance();

        const { data, error } = await supabase
            .from('deck')
            .update({ name: deckName })
            .eq('id', deckId)
            .select();

        console.log("Name update: " + data);
        error && console.log("Name update error: " + error);

        handleUpdateDeckImage().then((success) => {
            if (success) {
                console.log("Upload complete");
                location.reload();
            } else {
                if (deckImage) {
                    alert("The deck picture couldn't be updated...");
                } else location.reload();
            }
        })

    }

    const handleUpdateDeckImage = async () => {
        if (deckImage) {
            const supabase = getInstance();
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('DeckImages')
                .upload(`${deckId}.jpeg`, deckImage, {
                    cacheControl: '3600',
                    upsert: true
                });

            console.log("File uploaded: ", uploadData);
            uploadError && console.log("File upload error: ", uploadError);
            return !uploadError;
        }

        return false;
    }

    const handleResizeDeckImage = (file: File): Promise<File> =>
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

    const onChangeDeckImage = (ev: ChangeEvent<HTMLInputElement>) => {
        const files = ev.target.files;
        const imagePreview = document.getElementById('deck-image-preview') as HTMLImageElement;

        if (files && files[0]) {
            console.log(files[0])
            handleResizeDeckImage(files[0]).then((res) => {
                imagePreview.src = URL.createObjectURL(res)
                setDeckImage(res);
            }).catch(() => {
                imagePreview.removeAttribute("src");
                setDeckImage(undefined);
            })
        } else {
            imagePreview.removeAttribute("src");
            setDeckImage(undefined);
        }
    }

    useEffect(() => { loadDefaultValues(); }, []);

    return {
        editDialogOpen,
        setEditDialogOpen,
        deckName,
        setDeckName,
        originalDeckPictureUrl,
        onChangeDeckImage,
        handleUpdateDeck
    }

}