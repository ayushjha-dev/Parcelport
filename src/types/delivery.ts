import type { DeliveryIssueType } from './database';

export interface DeliveryOTPRequest {
  parcel_id: string;
  delivery_boy_id: string;
}

export interface DeliveryOTPVerifyRequest {
  parcel_id: string;
  otp_code: string;
}

export interface DeliveryIssueReport {
  parcel_id: string;
  failure_type: DeliveryIssueType;
  failure_note: string;
  failure_photo?: File;
}

export interface DeliveryPickupRequest {
  parcel_id: string;
  delivery_boy_id: string;
}

export interface DeliveryCompleteRequest {
  parcel_id: string;
  otp_code: string;
  delivery_photo?: File;
}
