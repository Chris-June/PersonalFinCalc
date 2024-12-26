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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          profile_id: string
          name: string
          category: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          category: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          category?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      liabilities: {
        Row: {
          id: string
          profile_id: string
          name: string
          category: string
          amount: number
          interest_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          category: string
          amount: number
          interest_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          category?: string
          amount?: number
          interest_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          profile_id: string
          category: string
          type: 'income' | 'expense'
          amount: number
          month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          category: string
          type: 'income' | 'expense'
          amount: number
          month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          category?: string
          type?: 'income' | 'expense'
          amount?: number
          month?: string
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          profile_id: string
          budget_id: string | null
          description: string
          amount: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          budget_id?: string | null
          description: string
          amount: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          budget_id?: string | null
          description?: string
          amount?: number
          date?: string
          created_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          profile_id: string
          name: string
          symbol: string | null
          quantity: number
          purchase_price: number
          purchase_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          symbol?: string | null
          quantity: number
          purchase_price: number
          purchase_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          symbol?: string | null
          quantity?: number
          purchase_price?: number
          purchase_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}