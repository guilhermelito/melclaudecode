-- Schema inicial: gestão de imóveis (properties, titularidade, contratos, seguros,
-- obrigações recorrentes, documentos). Ver briefing em Downloads/prompt-claude-code.md.

-- Trigger genérica para manter updated_at sempre em dia.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- properties (Imóveis)
-- =========================================================
create table properties (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  full_address text not null,
  country text not null check (country in ('BR', 'PT')),
  registration_number text,
  status text not null check (status in ('Ocupado', 'Vago', 'Airbnb-Temporada')) default 'Vago',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();

-- =========================================================
-- property_ownership (Titularidade)
-- =========================================================
create table property_ownership (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  owner_name text not null,
  owner_type text not null check (owner_type in ('PJ', 'PF')),
  percentage numeric(5, 2) not null check (percentage >= 0 and percentage <= 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index property_ownership_property_id_idx on property_ownership(property_id);

create trigger property_ownership_set_updated_at
  before update on property_ownership
  for each row execute function set_updated_at();

-- =========================================================
-- lease_contracts (Contratos de Locação)
-- =========================================================
create table lease_contracts (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  tenant_name text not null,
  lease_type text not null check (lease_type in ('Direto', 'Imobiliária')),
  agency_name text,
  start_date date,
  contract_end_date date,
  next_readjustment_date date,
  readjustment_index text,
  rent_value numeric(12, 2),
  currency text not null check (currency in ('BRL', 'EUR')),
  relevant_clause text,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index lease_contracts_property_id_idx on lease_contracts(property_id);

create trigger lease_contracts_set_updated_at
  before update on lease_contracts
  for each row execute function set_updated_at();

-- =========================================================
-- insurance_policies (Seguros)
-- =========================================================
create table insurance_policies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  insurer_name text not null,
  policy_number text,
  coverage_description text,
  coverage_start_date date,
  coverage_end_date date,
  premium_value numeric(12, 2),
  currency text not null check (currency in ('BRL', 'EUR')),
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index insurance_policies_property_id_idx on insurance_policies(property_id);

create trigger insurance_policies_set_updated_at
  before update on insurance_policies
  for each row execute function set_updated_at();

-- =========================================================
-- recurring_obligations (Obrigações Recorrentes)
-- =========================================================
create table recurring_obligations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  obligation_type text not null,
  payment_responsible text not null check (payment_responsible in ('Nós', 'Inquilino')),
  final_responsible text not null check (final_responsible in ('Nós', 'Inquilino')),
  frequency text not null,
  next_due_date date,
  estimated_value numeric(12, 2),
  currency text not null check (currency in ('BRL', 'EUR')),
  current_status text not null check (
    current_status in ('Em dia', 'Pendente', 'Aguardando reembolso', 'Vencido')
  ) default 'Em dia',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index recurring_obligations_property_id_idx on recurring_obligations(property_id);

create trigger recurring_obligations_set_updated_at
  before update on recurring_obligations
  for each row execute function set_updated_at();

-- =========================================================
-- documents (Documentos)
-- =========================================================
create table documents (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  related_contract_id uuid references lease_contracts(id) on delete set null,
  related_insurance_id uuid references insurance_policies(id) on delete set null,
  document_type text not null check (
    document_type in ('Contrato', 'Apólice de Seguro', 'Espelho IPTU/IMI', 'Nada Consta', 'Outro')
  ),
  file_path text not null,
  reference_date date,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index documents_property_id_idx on documents(property_id);

create trigger documents_set_updated_at
  before update on documents
  for each row execute function set_updated_at();

-- =========================================================
-- RLS: só os 3 usuários autenticados (todos admin) acessam qualquer linha.
-- Sem isso, as tabelas ficariam abertas para quem tiver a anon key.
-- =========================================================
alter table properties enable row level security;
alter table property_ownership enable row level security;
alter table lease_contracts enable row level security;
alter table insurance_policies enable row level security;
alter table recurring_obligations enable row level security;
alter table documents enable row level security;

create policy "authenticated full access" on properties
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on property_ownership
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on lease_contracts
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on insurance_policies
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on recurring_obligations
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on documents
  for all to authenticated using (true) with check (true);
