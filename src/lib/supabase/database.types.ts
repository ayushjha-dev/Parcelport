export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          new_status: Database["public"]["Enums"]["parcel_status"] | null
          old_status: Database["public"]["Enums"]["parcel_status"] | null
          parcel_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["parcel_status"] | null
          old_status?: Database["public"]["Enums"]["parcel_status"] | null
          parcel_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          new_status?: Database["public"]["Enums"]["parcel_status"] | null
          old_status?: Database["public"]["Enums"]["parcel_status"] | null
          parcel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_assignments: {
        Row: {
          assigned_by: string | null
          attempted_at: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_boy_id: string
          delivery_photo_url: string | null
          failed_at: string | null
          failure_note: string | null
          failure_photo_url: string | null
          failure_reason: string | null
          failure_type:
            | Database["public"]["Enums"]["delivery_issue_type"]
            | null
          id: string
          is_redelivery: boolean | null
          otp_code: string | null
          otp_expires_at: string | null
          otp_generated_at: string | null
          otp_verified_at: string | null
          parcel_id: string
          picked_from_gate_at: string | null
          redelivery_charge: number | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          attempted_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_boy_id: string
          delivery_photo_url?: string | null
          failed_at?: string | null
          failure_note?: string | null
          failure_photo_url?: string | null
          failure_reason?: string | null
          failure_type?:
            | Database["public"]["Enums"]["delivery_issue_type"]
            | null
          id?: string
          is_redelivery?: boolean | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_generated_at?: string | null
          otp_verified_at?: string | null
          parcel_id: string
          picked_from_gate_at?: string | null
          redelivery_charge?: number | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          attempted_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_boy_id?: string
          delivery_photo_url?: string | null
          failed_at?: string | null
          failure_note?: string | null
          failure_photo_url?: string | null
          failure_reason?: string | null
          failure_type?:
            | Database["public"]["Enums"]["delivery_issue_type"]
            | null
          id?: string
          is_redelivery?: boolean | null
          otp_code?: string | null
          otp_expires_at?: string | null
          otp_generated_at?: string | null
          otp_verified_at?: string | null
          parcel_id?: string
          picked_from_gate_at?: string | null
          redelivery_charge?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_delivery_boy_id_fkey"
            columns: ["delivery_boy_id"]
            isOneToOne: false
            referencedRelation: "delivery_boys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_boys: {
        Row: {
          campus_zone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          mobile: string
          name: string
          profile_id: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          campus_zone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mobile: string
          name: string
          profile_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          campus_zone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mobile?: string
          name?: string
          profile_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_boys_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          parcel_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          parcel_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          parcel_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          admin_note: string | null
          approved_at: string | null
          assigned_at: string | null
          cancelled_at: string | null
          courier_company: Database["public"]["Enums"]["courier_company"]
          created_at: string | null
          delivered_at: string | null
          drid: string
          expected_date: string | null
          failed_at: string | null
          floor_number: string
          hostel_block: string
          id: string
          is_fragile: boolean | null
          landmark_note: string | null
          out_for_delivery_at: string | null
          parcel_awb: string
          parcel_description: string
          preferred_time_slot: Database["public"]["Enums"]["time_slot"]
          rejected_reason: string | null
          room_number: string
          status: Database["public"]["Enums"]["parcel_status"] | null
          student_email: string
          student_id: string
          student_mobile: string
          student_name: string
          student_roll_no: string
          submitted_at: string | null
          updated_at: string | null
          weight_range: Database["public"]["Enums"]["weight_range"] | null
        }
        Insert: {
          admin_note?: string | null
          approved_at?: string | null
          assigned_at?: string | null
          cancelled_at?: string | null
          courier_company: Database["public"]["Enums"]["courier_company"]
          created_at?: string | null
          delivered_at?: string | null
          drid: string
          expected_date?: string | null
          failed_at?: string | null
          floor_number: string
          hostel_block: string
          id?: string
          is_fragile?: boolean | null
          landmark_note?: string | null
          out_for_delivery_at?: string | null
          parcel_awb: string
          parcel_description: string
          preferred_time_slot: Database["public"]["Enums"]["time_slot"]
          rejected_reason?: string | null
          room_number: string
          status?: Database["public"]["Enums"]["parcel_status"] | null
          student_email: string
          student_id: string
          student_mobile: string
          student_name: string
          student_roll_no: string
          submitted_at?: string | null
          updated_at?: string | null
          weight_range?: Database["public"]["Enums"]["weight_range"] | null
        }
        Update: {
          admin_note?: string | null
          approved_at?: string | null
          assigned_at?: string | null
          cancelled_at?: string | null
          courier_company?: Database["public"]["Enums"]["courier_company"]
          created_at?: string | null
          delivered_at?: string | null
          drid?: string
          expected_date?: string | null
          failed_at?: string | null
          floor_number?: string
          hostel_block?: string
          id?: string
          is_fragile?: boolean | null
          landmark_note?: string | null
          out_for_delivery_at?: string | null
          parcel_awb?: string
          parcel_description?: string
          preferred_time_slot?: Database["public"]["Enums"]["time_slot"]
          rejected_reason?: string | null
          room_number?: string
          status?: Database["public"]["Enums"]["parcel_status"] | null
          student_email?: string
          student_id?: string
          student_mobile?: string
          student_name?: string
          student_roll_no?: string
          submitted_at?: string | null
          updated_at?: string | null
          weight_range?: Database["public"]["Enums"]["weight_range"] | null
        }
        Relationships: [
          {
            foreignKeyName: "parcels_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          admin_note: string | null
          courier_challan_url: string | null
          courier_charge_amount: number | null
          courier_charge_type: Database["public"]["Enums"]["charge_type"] | null
          courier_pay_via_portal: boolean | null
          courier_payment_status:
            | Database["public"]["Enums"]["payment_status"]
            | null
          courier_razorpay_order_id: string | null
          courier_razorpay_payment_id: string | null
          created_at: string | null
          delivery_fee_amount: number
          delivery_fee_method:
            | Database["public"]["Enums"]["payment_method"]
            | null
          delivery_fee_payment_date: string | null
          delivery_fee_screenshot_url: string | null
          delivery_fee_status:
            | Database["public"]["Enums"]["payment_status"]
            | null
          delivery_fee_transaction_id: string | null
          delivery_fee_verified_at: string | null
          delivery_fee_verified_by: string | null
          has_courier_charge: boolean | null
          id: string
          parcel_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          rejection_reason: string | null
          updated_at: string | null
        }
        Insert: {
          admin_note?: string | null
          courier_challan_url?: string | null
          courier_charge_amount?: number | null
          courier_charge_type?:
            | Database["public"]["Enums"]["charge_type"]
            | null
          courier_pay_via_portal?: boolean | null
          courier_payment_status?:
            | Database["public"]["Enums"]["payment_status"]
            | null
          courier_razorpay_order_id?: string | null
          courier_razorpay_payment_id?: string | null
          created_at?: string | null
          delivery_fee_amount?: number
          delivery_fee_method?:
            | Database["public"]["Enums"]["payment_method"]
            | null
          delivery_fee_payment_date?: string | null
          delivery_fee_screenshot_url?: string | null
          delivery_fee_status?:
            | Database["public"]["Enums"]["payment_status"]
            | null
          delivery_fee_transaction_id?: string | null
          delivery_fee_verified_at?: string | null
          delivery_fee_verified_by?: string | null
          has_courier_charge?: boolean | null
          id?: string
          parcel_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_note?: string | null
          courier_challan_url?: string | null
          courier_charge_amount?: number | null
          courier_charge_type?:
            | Database["public"]["Enums"]["charge_type"]
            | null
          courier_pay_via_portal?: boolean | null
          courier_payment_status?:
            | Database["public"]["Enums"]["payment_status"]
            | null
          courier_razorpay_order_id?: string | null
          courier_razorpay_payment_id?: string | null
          created_at?: string | null
          delivery_fee_amount?: number
          delivery_fee_method?:
            | Database["public"]["Enums"]["payment_method"]
            | null
          delivery_fee_payment_date?: string | null
          delivery_fee_screenshot_url?: string | null
          delivery_fee_status?:
            | Database["public"]["Enums"]["payment_status"]
            | null
          delivery_fee_transaction_id?: string | null
          delivery_fee_verified_at?: string | null
          delivery_fee_verified_by?: string | null
          has_courier_charge?: boolean | null
          id?: string
          parcel_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          rejection_reason?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_delivery_fee_verified_by_fkey"
            columns: ["delivery_fee_verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          course_branch: string | null
          created_at: string | null
          email: string
          floor_number: string | null
          full_name: string
          hostel_block: string | null
          id: string
          is_active: boolean | null
          landmark_note: string | null
          mobile_number: string
          mobile_verified: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          room_number: string | null
          student_roll_no: string | null
          updated_at: string | null
        }
        Insert: {
          course_branch?: string | null
          created_at?: string | null
          email: string
          floor_number?: string | null
          full_name: string
          hostel_block?: string | null
          id: string
          is_active?: boolean | null
          landmark_note?: string | null
          mobile_number: string
          mobile_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          room_number?: string | null
          student_roll_no?: string | null
          updated_at?: string | null
        }
        Update: {
          course_branch?: string | null
          created_at?: string | null
          email?: string
          floor_number?: string | null
          full_name?: string
          hostel_block?: string | null
          id?: string
          is_active?: boolean | null
          landmark_note?: string | null
          mobile_number?: string
          mobile_verified?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          room_number?: string | null
          student_roll_no?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_drid: { Args: never; Returns: string }
      generate_otp: { Args: never; Returns: string }
    }
    Enums: {
      charge_type:
        | "cod"
        | "unpaid_shipping"
        | "custom_duty"
        | "return_charge"
        | "other"
      courier_company:
        | "amazon"
        | "flipkart"
        | "dtdc"
        | "bluedart"
        | "delhivery"
        | "ekart"
        | "speed_post"
        | "other"
      delivery_issue_type:
        | "student_not_available"
        | "wrong_room"
        | "parcel_not_at_gate"
        | "student_refused"
        | "other"
      parcel_status:
        | "submitted"
        | "payment_pending"
        | "payment_verified"
        | "assigned"
        | "out_for_delivery"
        | "delivered"
        | "failed_delivery"
        | "cancelled"
        | "rejected"
      payment_method:
        | "upi"
        | "debit_card"
        | "credit_card"
        | "net_banking"
        | "cash"
      payment_status: "pending" | "verified" | "rejected" | "refunded"
      time_slot: "morning" | "afternoon" | "evening"
      user_role: "student" | "admin" | "delivery_boy"
      weight_range: "under_1kg" | "1_to_5kg" | "5_to_10kg" | "over_10kg"
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
    Enums: {
      charge_type: [
        "cod",
        "unpaid_shipping",
        "custom_duty",
        "return_charge",
        "other",
      ],
      courier_company: [
        "amazon",
        "flipkart",
        "dtdc",
        "bluedart",
        "delhivery",
        "ekart",
        "speed_post",
        "other",
      ],
      delivery_issue_type: [
        "student_not_available",
        "wrong_room",
        "parcel_not_at_gate",
        "student_refused",
        "other",
      ],
      parcel_status: [
        "submitted",
        "payment_pending",
        "payment_verified",
        "assigned",
        "out_for_delivery",
        "delivered",
        "failed_delivery",
        "cancelled",
        "rejected",
      ],
      payment_method: [
        "upi",
        "debit_card",
        "credit_card",
        "net_banking",
        "cash",
      ],
      payment_status: ["pending", "verified", "rejected", "refunded"],
      time_slot: ["morning", "afternoon", "evening"],
      user_role: ["student", "admin", "delivery_boy"],
      weight_range: ["under_1kg", "1_to_5kg", "5_to_10kg", "over_10kg"],
    },
  },
} as const
