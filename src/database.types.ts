export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      card: {
        Row: {
          archetype: string | null
          atk: number | null
          attribute: string | null
          def: number | null
          description: string
          id: number
          image: string | null
          level: number | null
          linkval: number | null
          name: string
          race_type: string
          type: string
          ygoprodeck_url: string
        }
        Insert: {
          archetype?: string | null
          atk?: number | null
          attribute?: string | null
          def?: number | null
          description?: string
          id: number
          image?: string | null
          level?: number | null
          linkval?: number | null
          name?: string
          race_type?: string
          type?: string
          ygoprodeck_url?: string
        }
        Update: {
          archetype?: string | null
          atk?: number | null
          attribute?: string | null
          def?: number | null
          description?: string
          id?: number
          image?: string | null
          level?: number | null
          linkval?: number | null
          name?: string
          race_type?: string
          type?: string
          ygoprodeck_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Card_image_fkey"
            columns: ["image"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
        ]
      }
      card_in_deck: {
        Row: {
          card_id: number
          deck_id: string
          position: Database["public"]["Enums"]["CardPosition"]
          quantity: number
        }
        Insert: {
          card_id: number
          deck_id: string
          position: Database["public"]["Enums"]["CardPosition"]
          quantity?: number
        }
        Update: {
          card_id?: number
          deck_id?: string
          position?: Database["public"]["Enums"]["CardPosition"]
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "CardInDeck_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CardInDeck_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
        ]
      }
      deck: {
        Row: {
          id: string
          name: string
          owner: string | null
          points: number | null
          tier: number | null
          tierlist: Database["public"]["Enums"]["Tierlist"] | null
        }
        Insert: {
          id?: string
          name?: string
          owner?: string | null
          points?: number | null
          tier?: number | null
          tierlist?: Database["public"]["Enums"]["Tierlist"] | null
        }
        Update: {
          id?: string
          name?: string
          owner?: string | null
          points?: number | null
          tier?: number | null
          tierlist?: Database["public"]["Enums"]["Tierlist"] | null
        }
        Relationships: [
          {
            foreignKeyName: "Deck_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_movement_poll: {
        Row: {
          action: Database["public"]["Enums"]["PollAction"] | null
          date: string
          deck: string | null
          id: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["PollAction"] | null
          date?: string
          deck?: string | null
          id?: string
        }
        Update: {
          action?: Database["public"]["Enums"]["PollAction"] | null
          date?: string
          deck?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "DeckMovementPoll_deck_fkey"
            columns: ["deck"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_movement_poll_vote: {
        Row: {
          date: string | null
          poll_id: string
          type: Database["public"]["Enums"]["PollVote"] | null
          user_id: string
        }
        Insert: {
          date?: string | null
          poll_id: string
          type?: Database["public"]["Enums"]["PollVote"] | null
          user_id: string
        }
        Update: {
          date?: string | null
          poll_id?: string
          type?: Database["public"]["Enums"]["PollVote"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "DeckMovementPollVote_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "deck_movement_poll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "DeckMovementPollVote_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      match: {
        Row: {
          date: string
          id: string
          side_deck: boolean | null
          type: Database["public"]["Enums"]["MatchType"] | null
        }
        Insert: {
          date?: string
          id?: string
          side_deck?: boolean | null
          type?: Database["public"]["Enums"]["MatchType"] | null
        }
        Update: {
          date?: string
          id?: string
          side_deck?: boolean | null
          type?: Database["public"]["Enums"]["MatchType"] | null
        }
        Relationships: []
      }
      match_data: {
        Row: {
          deck: string
          deck_point_changes: string | null
          match_id: string
          player: string
          score: number | null
          winner: boolean | null
        }
        Insert: {
          deck: string
          deck_point_changes?: string | null
          match_id: string
          player: string
          score?: number | null
          winner?: boolean | null
        }
        Update: {
          deck?: string
          deck_point_changes?: string | null
          match_id?: string
          player?: string
          score?: number | null
          winner?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "MatchData_deck_fkey"
            columns: ["deck"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MatchData_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "match"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MatchData_player_fkey"
            columns: ["player"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          display_name: string
          id: string
          username: string
        }
        Insert: {
          avatar?: string | null
          display_name?: string
          id: string
          username?: string
        }
        Update: {
          avatar?: string | null
          display_name?: string
          id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_avatar_fkey"
            columns: ["avatar"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_avatar_by_user_id: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      upload_img_from_url: {
        Args: {
          url: string
        }
        Returns: string
      }
      upload_img_from_url_2: {
        Args: {
          url: string
        }
        Returns: string
      }
    }
    Enums: {
      CardPosition: "MAIN" | "EXTRA" | "SIDE"
      MatchType: "1VS1" | "2VS2" | "3VS3" | "ALLVSALL"
      PollAction: "TIERUP" | "TIERDOWN" | "TIERLISTUP" | "TIERLISTDOWN"
      PollVote: "UP" | "DOWN" | "NEUTRAL"
      Tierlist: "META" | "CHILL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
