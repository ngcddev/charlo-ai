-- ============================================================
-- Charló.ai — tabla de clientes (negocios que usan el servicio)
-- ============================================================

create table public.clients (
  id                       uuid        primary key default gen_random_uuid(),
  phone_number             text        unique not null,
  business_name            text        not null,
  sector                   text        not null,
  tone                     text        not null,
  faqs                     jsonb       not null default '[]'::jsonb,
  schedule                 text        not null,
  whatsapp_phone_number_id text        not null,
  whatsapp_access_token    text        not null,
  active                   boolean     not null default true,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- Índice para lookups rápidos por número de teléfono del negocio
create index clients_phone_number_idx on public.clients (phone_number);

-- Trigger de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- RLS: tabla de configuración con tokens sensibles.
-- Ninguna policy para anon/authenticated → acceso denegado.
-- service_role bypasses RLS por defecto → acceso permitido.
-- ============================================================
alter table public.clients enable row level security;
