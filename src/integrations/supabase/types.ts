export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alert_types: {
        Row: {
          created_at: string | null
          id: string
          label: string
          severity: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          severity: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          severity?: string
          value?: string
        }
        Relationships: []
      }
      auditors: {
        Row: {
          created_at: string
          email: string
          Employee_ID: number | null
          id: string
          Location: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          Employee_ID?: number | null
          id?: string
          Location?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          Employee_ID?: number | null
          id?: string
          Location?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audits: {
        Row: {
          auditor_id: string
          created_at: string
          custom_audit_id: string | null
          datacenter_id: string | null
          datahall_id: string | null
          description: string | null
          end_time: string | null
          id: string
          start_time: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          auditor_id: string
          created_at?: string
          custom_audit_id?: string | null
          datacenter_id?: string | null
          datahall_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          auditor_id?: string
          created_at?: string
          custom_audit_id?: string | null
          datacenter_id?: string | null
          datahall_id?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audits_datacenter_id_fkey"
            columns: ["datacenter_id"]
            isOneToOne: false
            referencedRelation: "datacenters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audits_datahall_id_fkey"
            columns: ["datahall_id"]
            isOneToOne: false
            referencedRelation: "datahalls"
            referencedColumns: ["id"]
          },
        ]
      }
      datacenters: {
        Row: {
          alias: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      datahalls: {
        Row: {
          alias: string | null
          created_at: string
          datacenter_id: string
          id: string
          name: string
        }
        Insert: {
          alias?: string | null
          created_at?: string
          datacenter_id: string
          id?: string
          name: string
        }
        Update: {
          alias?: string | null
          created_at?: string
          datacenter_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "datahalls_datacenter_id_fkey"
            columns: ["datacenter_id"]
            isOneToOne: false
            referencedRelation: "datacenters"
            referencedColumns: ["id"]
          },
        ]
      }
      device_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          assigned_to: string | null
          audit_id: string | null
          auditor_id: string
          created_at: string
          datacenter_alias: string | null
          datahall_alias: string | null
          description: string | null
          device_id: string | null
          formatted_id: string | null
          id: string
          resolved_at: string | null
          severity: string
          status: string
          tile_location: string | null
          title: string
          u_height: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          audit_id?: string | null
          auditor_id: string
          created_at?: string
          datacenter_alias?: string | null
          datahall_alias?: string | null
          description?: string | null
          device_id?: string | null
          formatted_id?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          tile_location?: string | null
          title: string
          u_height?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          audit_id?: string | null
          auditor_id?: string
          created_at?: string
          datacenter_alias?: string | null
          datahall_alias?: string | null
          description?: string | null
          device_id?: string | null
          formatted_id?: string | null
          id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          tile_location?: string | null
          title?: string
          u_height?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audits"
            referencedColumns: ["id"]
          },
        ]
      }
      tile_locations: {
        Row: {
          created_at: string
          datahall_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          datahall_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          datahall_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tile_locations_datahall_id_fkey"
            columns: ["datahall_id"]
            isOneToOne: false
            referencedRelation: "datahalls"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
