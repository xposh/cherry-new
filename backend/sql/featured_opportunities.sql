-- Create the featured_opportunities table.
-- Run this manually in pgAdmin or any SQL client connected to your database.

CREATE TABLE IF NOT EXISTS public.featured_opportunities (
    id SERIAL PRIMARY KEY,
    owner_id uuid NOT NULL,
    owner_role public.user_role NOT NULL,
    title text NOT NULL,
    description text,
    image_url text,
    video_url text,
    deadline timestamptz NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS featured_opportunities_owner_idx
    ON public.featured_opportunities (owner_id);

CREATE INDEX IF NOT EXISTS featured_opportunities_deadline_idx
    ON public.featured_opportunities (deadline);
