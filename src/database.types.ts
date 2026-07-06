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
      savings_goal: {
        Row: {
          created_at: string | null
          current: number
          deadline: string | null
          emoji: string | null
          id: string
          name: string
          notes: string | null
          target: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current?: number
          deadline?: string | null
          emoji?: string | null
          id?: string
          name: string
          notes?: string | null
          target: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current?: number
          deadline?: string | null
          emoji?: string | null
          id?: string
          name?: string
          notes?: string | null
          target?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Row']

export type InsertTables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Insert']

export type UpdateTables<
  TableName extends keyof Database['public']['Tables']
> = Database['public']['Tables'][TableName]['Update']
