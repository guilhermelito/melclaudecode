export type Country = "BR" | "PT";
export type PropertyStatus = "Ocupado" | "Vago" | "Airbnb-Temporada";

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
