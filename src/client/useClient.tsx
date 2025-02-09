import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

let clientInstance: SupabaseClient<Database> | null = null;

export const useClient = () => {

    // Create a single supabase client for interacting with your database
    const getInstance = () => {
        if (clientInstance == null) {
            const supabase = createClient<Database>(
                import.meta.env.VITE_SUPABASE_URL ?? "",
                import.meta.env.VITE_SUPABASE_PUBLIC_KEY ?? ''
            );
            clientInstance = supabase;
        }

        return clientInstance;
    }

    return {
        getInstance
    }
}