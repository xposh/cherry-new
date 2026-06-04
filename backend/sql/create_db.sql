--
-- PostgreSQL database dump
--

\restrict ZHXyqaeq0USJ5nLDsTWGenbt0hwSngSHLN2PsfWhUMDZqPuvW2CNhc0hS6sHFKY

-- Dumped from database version 18.3 (Postgres.app)
-- Dumped by pg_dump version 18.3 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: posh
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'talent',
    'company'
);


ALTER TYPE public.user_role OWNER TO posh;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_feed; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.activity_feed (
    id integer NOT NULL,
    user_id uuid,
    activity_type character varying(50) NOT NULL,
    related_user_id uuid,
    related_user_name character varying(255),
    related_user_image text,
    activity_text text NOT NULL,
    activity_count integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.activity_feed OWNER TO posh;

--
-- Name: activity_feed_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.activity_feed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_feed_id_seq OWNER TO posh;

--
-- Name: activity_feed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.activity_feed_id_seq OWNED BY public.activity_feed.id;


--
-- Name: cherry_picks; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.cherry_picks (
    user_id uuid NOT NULL,
    pick_id uuid NOT NULL
);


ALTER TABLE public.cherry_picks OWNER TO posh;

--
-- Name: company_profiles; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.company_profiles (
    user_id uuid NOT NULL,
    profile_data jsonb NOT NULL
);


ALTER TABLE public.company_profiles OWNER TO posh;

--
-- Name: daily_engagement; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.daily_engagement (
    id integer NOT NULL,
    user_id uuid,
    engagement_date date NOT NULL,
    activities_count integer DEFAULT 0,
    is_active boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.daily_engagement OWNER TO posh;

--
-- Name: daily_engagement_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.daily_engagement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_engagement_id_seq OWNER TO posh;

--
-- Name: daily_engagement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.daily_engagement_id_seq OWNED BY public.daily_engagement.id;


--
-- Name: handpicked_opportunities; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.handpicked_opportunities (
    id integer NOT NULL,
    company_name character varying(255) NOT NULL,
    company_city character varying(255),
    company_country character varying(255),
    job_role character varying(255) NOT NULL,
    job_description text,
    image_url text,
    video_url text,
    target_skills text[],
    target_locations text[],
    is_featured boolean DEFAULT false,
    priority integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.handpicked_opportunities OWNER TO posh;

--
-- Name: handpicked_opportunities_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.handpicked_opportunities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.handpicked_opportunities_id_seq OWNER TO posh;

--
-- Name: handpicked_opportunities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.handpicked_opportunities_id_seq OWNED BY public.handpicked_opportunities.id;


--
-- Name: matches; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.matches (
    id integer NOT NULL,
    talent_id uuid,
    company_id uuid,
    status character varying(20) DEFAULT 'pending'::character varying,
    last_message_from uuid,
    last_message_at timestamp without time zone,
    company_responded boolean DEFAULT false,
    company_response_time_hours integer,
    talent_responded boolean DEFAULT false,
    talent_response_time_hours integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.matches OWNER TO posh;

--
-- Name: matches_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.matches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.matches_id_seq OWNER TO posh;

--
-- Name: matches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.matches_id_seq OWNED BY public.matches.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    match_id integer,
    sender_id uuid,
    receiver_id uuid,
    message_text text NOT NULL,
    message_length integer,
    is_quality_message boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO posh;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO posh;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: profile_views; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.profile_views (
    id integer NOT NULL,
    viewed_user_id uuid,
    viewer_user_id uuid,
    viewed_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.profile_views OWNER TO posh;

--
-- Name: profile_views_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.profile_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_views_id_seq OWNER TO posh;

--
-- Name: profile_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.profile_views_id_seq OWNED BY public.profile_views.id;


--
-- Name: saved_profiles; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.saved_profiles (
    id integer NOT NULL,
    user_id uuid,
    saved_user_id uuid,
    action_type character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.saved_profiles OWNER TO posh;

--
-- Name: saved_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.saved_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saved_profiles_id_seq OWNER TO posh;

--
-- Name: saved_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.saved_profiles_id_seq OWNED BY public.saved_profiles.id;


--
-- Name: screen_time_sessions; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.screen_time_sessions (
    id integer NOT NULL,
    user_id uuid,
    session_start timestamp without time zone DEFAULT now(),
    session_end timestamp without time zone,
    duration_minutes integer DEFAULT 0
);


ALTER TABLE public.screen_time_sessions OWNER TO posh;

--
-- Name: screen_time_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.screen_time_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.screen_time_sessions_id_seq OWNER TO posh;

--
-- Name: screen_time_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.screen_time_sessions_id_seq OWNED BY public.screen_time_sessions.id;


--
-- Name: talent_profiles; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.talent_profiles (
    user_id uuid NOT NULL,
    profile_data jsonb NOT NULL
);


ALTER TABLE public.talent_profiles OWNER TO posh;

--
-- Name: user_analytics; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.user_analytics (
    id integer NOT NULL,
    user_id uuid,
    profile_completeness_score integer DEFAULT 0,
    engagement_score integer DEFAULT 0,
    freshness_score integer DEFAULT 0,
    total_readiness_score integer DEFAULT 0,
    last_calculated timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_analytics OWNER TO posh;

--
-- Name: user_analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: posh
--

CREATE SEQUENCE public.user_analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_analytics_id_seq OWNER TO posh;

--
-- Name: user_analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: posh
--

ALTER SEQUENCE public.user_analytics_id_seq OWNED BY public.user_analytics.id;


--
-- Name: user_interactions; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.user_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    from_user_id uuid NOT NULL,
    to_user_id uuid NOT NULL,
    action character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_interactions_action_check CHECK (((action)::text = ANY ((ARRAY['like'::character varying, 'skip'::character varying])::text[])))
);


ALTER TABLE public.user_interactions OWNER TO posh;

--
-- Name: users; Type: TABLE; Schema: public; Owner: posh
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    hashed_password text NOT NULL,
    role public.user_role NOT NULL
);


ALTER TABLE public.users OWNER TO posh;

--
-- Name: activity_feed id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.activity_feed ALTER COLUMN id SET DEFAULT nextval('public.activity_feed_id_seq'::regclass);


--
-- Name: daily_engagement id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.daily_engagement ALTER COLUMN id SET DEFAULT nextval('public.daily_engagement_id_seq'::regclass);


--
-- Name: handpicked_opportunities id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.handpicked_opportunities ALTER COLUMN id SET DEFAULT nextval('public.handpicked_opportunities_id_seq'::regclass);


--
-- Name: matches id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches ALTER COLUMN id SET DEFAULT nextval('public.matches_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: profile_views id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.profile_views ALTER COLUMN id SET DEFAULT nextval('public.profile_views_id_seq'::regclass);


--
-- Name: saved_profiles id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.saved_profiles ALTER COLUMN id SET DEFAULT nextval('public.saved_profiles_id_seq'::regclass);


--
-- Name: screen_time_sessions id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.screen_time_sessions ALTER COLUMN id SET DEFAULT nextval('public.screen_time_sessions_id_seq'::regclass);


--
-- Name: user_analytics id; Type: DEFAULT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_analytics ALTER COLUMN id SET DEFAULT nextval('public.user_analytics_id_seq'::regclass);


--
-- Name: activity_feed activity_feed_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_pkey PRIMARY KEY (id);


--
-- Name: cherry_picks cherry_picks_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.cherry_picks
    ADD CONSTRAINT cherry_picks_pkey PRIMARY KEY (user_id, pick_id);


--
-- Name: company_profiles company_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: daily_engagement daily_engagement_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.daily_engagement
    ADD CONSTRAINT daily_engagement_pkey PRIMARY KEY (id);


--
-- Name: daily_engagement daily_engagement_user_id_engagement_date_key; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.daily_engagement
    ADD CONSTRAINT daily_engagement_user_id_engagement_date_key UNIQUE (user_id, engagement_date);


--
-- Name: handpicked_opportunities handpicked_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.handpicked_opportunities
    ADD CONSTRAINT handpicked_opportunities_pkey PRIMARY KEY (id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: matches matches_talent_id_company_id_key; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_talent_id_company_id_key UNIQUE (talent_id, company_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: profile_views profile_views_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT profile_views_pkey PRIMARY KEY (id);


--
-- Name: saved_profiles saved_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.saved_profiles
    ADD CONSTRAINT saved_profiles_pkey PRIMARY KEY (id);


--
-- Name: saved_profiles saved_profiles_user_id_saved_user_id_action_type_key; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.saved_profiles
    ADD CONSTRAINT saved_profiles_user_id_saved_user_id_action_type_key UNIQUE (user_id, saved_user_id, action_type);


--
-- Name: screen_time_sessions screen_time_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.screen_time_sessions
    ADD CONSTRAINT screen_time_sessions_pkey PRIMARY KEY (id);


--
-- Name: talent_profiles talent_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.talent_profiles
    ADD CONSTRAINT talent_profiles_pkey PRIMARY KEY (user_id);


--
-- Name: user_analytics user_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_analytics
    ADD CONSTRAINT user_analytics_pkey PRIMARY KEY (id);


--
-- Name: user_analytics user_analytics_user_id_key; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_analytics
    ADD CONSTRAINT user_analytics_user_id_key UNIQUE (user_id);


--
-- Name: user_interactions user_interactions_from_user_id_to_user_id_key; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_interactions
    ADD CONSTRAINT user_interactions_from_user_id_to_user_id_key UNIQUE (from_user_id, to_user_id);


--
-- Name: user_interactions user_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_interactions
    ADD CONSTRAINT user_interactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_interactions_from; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_interactions_from ON public.user_interactions USING btree (from_user_id);


--
-- Name: idx_match_messages; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_match_messages ON public.messages USING btree (match_id, created_at);


--
-- Name: idx_receiver; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_receiver ON public.messages USING btree (receiver_id, read_at);


--
-- Name: idx_user_activity; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_user_activity ON public.activity_feed USING btree (user_id, created_at DESC);


--
-- Name: idx_user_engagement; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_user_engagement ON public.daily_engagement USING btree (user_id, engagement_date DESC);


--
-- Name: idx_user_saves; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_user_saves ON public.saved_profiles USING btree (user_id, created_at);


--
-- Name: idx_user_time; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_user_time ON public.screen_time_sessions USING btree (user_id, session_start);


--
-- Name: idx_viewed_user; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_viewed_user ON public.profile_views USING btree (viewed_user_id, viewed_at);


--
-- Name: idx_viewer_user; Type: INDEX; Schema: public; Owner: posh
--

CREATE INDEX idx_viewer_user ON public.profile_views USING btree (viewer_user_id, viewed_at);


--
-- Name: activity_feed activity_feed_related_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_related_user_id_fkey FOREIGN KEY (related_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: activity_feed activity_feed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.activity_feed
    ADD CONSTRAINT activity_feed_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: cherry_picks cherry_picks_pick_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.cherry_picks
    ADD CONSTRAINT cherry_picks_pick_id_fkey FOREIGN KEY (pick_id) REFERENCES public.users(id);


--
-- Name: cherry_picks cherry_picks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.cherry_picks
    ADD CONSTRAINT cherry_picks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: company_profiles company_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.company_profiles
    ADD CONSTRAINT company_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: daily_engagement daily_engagement_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.daily_engagement
    ADD CONSTRAINT daily_engagement_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: matches matches_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: matches matches_last_message_from_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_last_message_from_fkey FOREIGN KEY (last_message_from) REFERENCES public.users(id);


--
-- Name: matches matches_talent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_talent_id_fkey FOREIGN KEY (talent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.matches(id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: profile_views profile_views_viewed_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT profile_views_viewed_user_id_fkey FOREIGN KEY (viewed_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: profile_views profile_views_viewer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.profile_views
    ADD CONSTRAINT profile_views_viewer_user_id_fkey FOREIGN KEY (viewer_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: saved_profiles saved_profiles_saved_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.saved_profiles
    ADD CONSTRAINT saved_profiles_saved_user_id_fkey FOREIGN KEY (saved_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: saved_profiles saved_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.saved_profiles
    ADD CONSTRAINT saved_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: screen_time_sessions screen_time_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.screen_time_sessions
    ADD CONSTRAINT screen_time_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: talent_profiles talent_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.talent_profiles
    ADD CONSTRAINT talent_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_analytics user_analytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_analytics
    ADD CONSTRAINT user_analytics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_interactions user_interactions_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_interactions
    ADD CONSTRAINT user_interactions_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_interactions user_interactions_to_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: posh
--

ALTER TABLE ONLY public.user_interactions
    ADD CONSTRAINT user_interactions_to_user_id_fkey FOREIGN KEY (to_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict ZHXyqaeq0USJ5nLDsTWGenbt0hwSngSHLN2PsfWhUMDZqPuvW2CNhc0hS6sHFKY

