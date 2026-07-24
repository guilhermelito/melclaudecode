export type Country = "BR" | "PT";
export type PropertyStatus = "Ocupado" | "Vago" | "Airbnb-Temporada";
export type Currency = "BRL" | "EUR";
export type OwnerType = "PJ" | "PF";
export type LeaseType = "Direto" | "Imobiliária";
export type Responsible = "Nós" | "Inquilino";
export type ObligationStatus = "Em dia" | "Pendente" | "Aguardando reembolso" | "Vencido";

export type Property = {
  id: string;
  nickname: string;
  full_address: string;
  country: Country;
  registration_number: string | null;
  status: PropertyStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type PropertyOwnership = {
  id: string;
  property_id: string;
  owner_name: string;
  owner_type: OwnerType;
  percentage: number;
  notes: string | null;
};

export type LeaseContract = {
  id: string;
  property_id: string;
  tenant_name: string;
  lease_type: LeaseType;
  agency_name: string | null;
  start_date: string | null;
  contract_end_date: string | null;
  next_readjustment_date: string | null;
  readjustment_index: string | null;
  rent_value: number | null;
  currency: Currency;
  relevant_clause: string | null;
  is_active: boolean;
  notes: string | null;
};

export type InsurancePolicy = {
  id: string;
  property_id: string;
  insurer_name: string;
  policy_number: string | null;
  coverage_description: string | null;
  coverage_start_date: string | null;
  coverage_end_date: string | null;
  premium_value: number | null;
  currency: Currency;
  is_active: boolean;
  notes: string | null;
};

export type RecurringObligation = {
  id: string;
  property_id: string;
  obligation_type: string;
  payment_responsible: Responsible;
  final_responsible: Responsible;
  frequency: string;
  next_due_date: string | null;
  estimated_value: number | null;
  currency: Currency;
  current_status: ObligationStatus;
  notes: string | null;
};
