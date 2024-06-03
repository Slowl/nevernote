import { OutputData } from '@editorjs/editorjs'

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
			notes: {
				Row: {
					color?: string | null
					content: OutputData
					created_at: string
					created_by: string
					id: string
					is_archived: boolean
					public_note_id: string | null
					shared_with: string[] | null
					title: string
					updated_at: string | null
					updated_by: string | null
				}
				Insert: {
					color?: string | null
					content?: OutputData
					created_at?: string
					created_by: string
					id?: string
					is_archived?: boolean
					public_note_id?: string | null
					shared_with?: string[] | null
					title: string
					updated_at?: Date
					updated_by?: string | null
				}
				Update: {
					color?: string | null
					content?: OutputData
					created_at?: string
					created_by?: string
					id?: string
					is_archived?: boolean
					public_note_id?: string | null
					shared_with?: string[] | null
					title?: string
					updated_at?: Date
					updated_by?: string | null
				}
        Relationships: [
          {
            foreignKeyName: 'notes_public_note_id_fkey'
            columns: ['public_note_id']
            isOneToOne: false
            referencedRelation: 'public_notes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notes_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_notes_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          email: string | null
          first_name: string | null
          id: string
          is_deactivated: boolean | null
          is_subscribed: boolean | null
          last_name: string | null
          trusted_users: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          is_deactivated?: boolean | null
          is_subscribed?: boolean | null
          last_name?: string | null
          trusted_users?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          is_deactivated?: boolean | null
          is_subscribed?: boolean | null
          last_name?: string | null
          trusted_users?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
			public_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          related_note: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          related_note?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          related_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_notes_created_by_fkey1'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_notes_related_note_fkey'
            columns: ['related_note']
            isOneToOne: false
            referencedRelation: 'notes'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      getPublicNoteContent: {
        Args: {
          note_id: string
        }
        Returns: Json
      }
      getPublicNoteTitle: {
        Args: {
          note_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never