export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'overdue'
export type TaskType = 'assignment' | 'exam' | 'project' | 'reading' | 'other'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type ChecklistItem = {
  id: string
  text: string
  done: boolean
}

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
      academic_task: {
        Row: {
          created_at: string | null
          date_given: string | null
          details: string | null
          due_date: string | null
          id: string
          links: string | null
          priority: TaskPriority
          status: TaskStatus
          subject: string
          task_type: TaskType
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_given?: string | null
          details?: string | null
          due_date?: string | null
          id?: string
          links?: string | null
          priority?: TaskPriority
          status?: TaskStatus
          subject: string
          task_type?: TaskType
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_given?: string | null
          details?: string | null
          due_date?: string | null
          id?: string
          links?: string | null
          priority?: TaskPriority
          status?: TaskStatus
          subject?: string
          task_type?: TaskType
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      class_slot: {
        Row: {
          id: string
          user_id: string
          class_name: string
          course_code: string | null
          instructor: string | null
          room: string | null
          day_of_week: number
          start_time: string
          end_time: string
          color: string
          is_break: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          class_name: string
          course_code?: string | null
          instructor?: string | null
          room?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          color?: string
          is_break?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          class_name?: string
          course_code?: string | null
          instructor?: string | null
          room?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          color?: string
          is_break?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_event: {
        Row: {
          id: string
          user_id: string
          title: string
          event_time: string | null
          end_time: string | null
          location: string | null
          notes: string | null
          event_date: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          event_time?: string | null
          end_time?: string | null
          location?: string | null
          notes?: string | null
          event_date: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          event_time?: string | null
          end_time?: string | null
          location?: string | null
          notes?: string | null
          event_date?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      master_todo: {
        Row: {
          id: string
          user_id: string
          title: string
          notes: string | null
          is_completed: boolean
          sort_order: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          notes?: string | null
          is_completed?: boolean
          sort_order?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          notes?: string | null
          is_completed?: boolean
          sort_order?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notebook_note: {
        Row: {
          id: string
          user_id: string
          title: string
          content_html: string
          checklist: Json
          tags: string[]
          is_pinned: boolean
          is_archived: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content_html?: string
          checklist?: Json
          tags?: string[]
          is_pinned?: boolean
          is_archived?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content_html?: string
          checklist?: Json
          tags?: string[]
          is_pinned?: boolean
          is_archived?: boolean
          created_at?: string | null
          updated_at?: string | null
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
