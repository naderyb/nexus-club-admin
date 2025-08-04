--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_credits; Type: TABLE; Schema: public; Owner: postgres
--
DROP TABLE IF EXISTS public.admin_credits CASCADE;

CREATE TABLE IF NOT EXISTS public.admin_credits (
    id integer NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    role_id integer
);


ALTER TABLE public.admin_credits OWNER TO neondb_owner;

--
-- Name: admin_credits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

DROP SEQUENCE IF EXISTS public.admin_credits_id_seq CASCADE;

CREATE SEQUENCE public.admin_credits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_credits_id_seq OWNER TO neondb_owner;

--
-- Name: admin_credits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_credits_id_seq OWNED BY public.admin_credits.id;


--
-- Name: admin_roles; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE IF EXISTS public.admin_roles CASCADE;

CREATE TABLE IF NOT EXISTS public.admin_roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL,
    description text
);


ALTER TABLE public.admin_roles OWNER TO neondb_owner;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

DROP SEQUENCE IF EXISTS public.admin_roles_id_seq CASCADE;

CREATE SEQUENCE public.admin_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_roles_id_seq OWNER TO neondb_owner;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_roles_id_seq OWNED BY public.admin_roles.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE IF EXISTS public.events CASCADE;

CREATE TABLE IF NOT EXISTS public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    date timestamp without time zone NOT NULL,
    location character varying(255),
    image_url character varying(255),
    video_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_urls text[]
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

DROP SEQUENCE IF EXISTS public.events_id_seq CASCADE;

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE IF EXISTS public.members CASCADE;

CREATE TABLE IF NOT EXISTS public.members (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    profile_picture_url character varying(255),
    phone character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.members OWNER TO neondb_owner;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

DROP SEQUENCE IF EXISTS public.members_id_seq CASCADE;

CREATE SEQUENCE public.members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.members_id_seq OWNER TO neondb_owner;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE IF EXISTS public.projects CASCADE;

CREATE TABLE IF NOT EXISTS public.projects (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status character varying(50),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    image_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    site_url character varying(255)
);


ALTER TABLE public.projects OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--


DROP SEQUENCE IF EXISTS public.projects_id_seq CASCADE;

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: admin_credits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_credits ALTER COLUMN id SET DEFAULT nextval('public.admin_credits_id_seq'::regclass);


--
-- Name: admin_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_roles ALTER COLUMN id SET DEFAULT nextval('public.admin_roles_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Data for Name: admin_credits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_credits (id, nom, prenom, email, password, telephone, role_id) FROM stdin;
1	youb	mahmoud nader	youb.nader@gmail.com	$2b$10$d0Ecsx9VdaxgSxLbtBCOt.wcoMZpue7g9OB/qVw8KF72sSrWTLg5a	+213 540 58 89 87	1
2	tabbi	mohamed kamel seif eddine	tabbiseif@gmail.com	$2b$10$S86gQGiwvxHf8iHVTh/GFeAuAc2Uv/7EenvTEA2OFfIuKTzLv//hG	+213 552 16 89 54	2
3	boutaoui	selena	selenaboutaoui30@gmail.com	$2b$10$cjyQsyncX4PscNotyYRxMemLNRWr95pm641NXSvpLZEJpKcoR2uNa	+213 669 02 37 13	3
\.


--
-- Data for Name: admin_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_roles (id, role_name, description) FROM stdin;
1	president	President of the club
2	VP	Vice president
3	SG	General secretary
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, date, location, image_url, video_url, created_at, updated_at, image_urls) FROM stdin;
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.members (id, nom, email, role, profile_picture_url, phone, created_at, updated_at) FROM stdin;
1	youb Mahmoud nader	youb.nader@gmail.com	president	/default-profile.png	0540588987	2025-07-24 12:36:15.839344	2025-07-24 12:36:15.839344
2	Tabbi Mohamed Kemal Seif Eddine	tabbiseif@gmail.com	vice-president	/default-profile.png	0552168954	2025-07-24 13:47:38.783555	2025-07-24 13:47:38.783555
3	Boutaoui Selena	selenaboutaoui30@gmail.com	general secretary	/default-profile.png	0669023713	2025-07-24 13:48:39.710048	2025-07-24 13:48:39.710048
4	Ouchaoui Sara Amilya	ouchaousarah5@gmail.com	respo com	/default-profile.png	0561467647	2025-07-24 13:49:37.863329	2025-07-24 13:49:37.863329
5	Lekahal Massil	massillakehal8@gmail.com	respo logistics	/default-profile.png	0552111876	2025-07-24 13:52:24.720357	2025-07-24 13:52:24.720357
7	BOUSSAA Ania-Sarah	boussaaania@gmail.com	respo marketing	/default-profile.png	0557177510	2025-07-24 13:56:58.421867	2025-07-24 13:56:58.421867
6	HADJ SADOK Salsabyl Lyna	shadjsadok03@gmail.com	respo marketing	/default-profile.png	0549700197	2025-07-24 13:56:10.943349	2025-07-24 13:56:10.943349
10	BOUMEHDI Rym (Lydia)	boumehdirym0@gmail.com	respo rel-ex	/default-profile.png	0791244909	2025-07-24 14:11:37.900631	2025-07-24 14:11:37.900631
13	BEDOUD Hadil	hadilhudhud07@gmail.com	membre marketing	/default-profile.png	0672551174	2025-07-24 14:18:52.285557	2025-07-24 14:18:52.285557
14	OTSMAN Rami	na_otsman@esi.dz	membre marketing	/default-profile.png	0553842579	2025-07-24 14:21:27.277168	2025-07-24 14:21:27.277168
15	MOHABEDDINE Kenza	kenzamohabeddine@gmail.com	membre marketing	/default-profile.png	0781215766	2025-07-24 14:23:18.263342	2025-07-24 14:23:18.263342
16	YACINI Wissam	wiya2005@gmail.com	membre marketing	/default-profile.png	0541264795	2025-07-24 14:24:26.157266	2025-07-24 14:24:26.157266
17	KADRI Mohamed Racim	mohamedracimkdr02@gmail.com	membre marketing	/default-profile.png	06 67 09 23 24	2025-07-24 14:25:00.639734	2025-07-24 14:25:00.639734
11	HADJI Sidali	ns_hadji@esi.dz	respo dev	/default-profile.png	0540026451	2025-07-24 14:12:53.151335	2025-07-24 14:12:53.151335
22	AYADI Nedjm Eddine	nedjmo2023@gmail.com	membre logistics	/default-profile.png	0557522166	2025-07-24 14:43:26.224287	2025-07-24 14:43:26.224287
23	riadh	no-reply@noreply.com	membre logistics	/default-profile.png	0552819913	2025-07-24 14:44:49.033541	2025-07-24 14:44:49.033541
24	OUARZEDDINI Mohamed Rayane	mrouarzeddini@gmail.com	membre logistics	/default-profile.png	05 53 02 47 67	2025-07-24 14:45:35.695897	2025-07-24 14:45:35.695897
25	BOUROU Myriem	bouroumyriem@gmail.com	membre marketing	/default-profile.png	0560039450	2025-07-24 14:47:24.763596	2025-07-24 14:47:24.763596
27	ZEBBAR Farah	zebbarfarah9@gmail.com	membre rel-ex	/default-profile.png	0771552302	2025-07-24 14:49:01.540137	2025-07-24 14:49:01.540137
28	SAHBI Nyl	sahbinyl@gmail.com	alumni	/default-profile.png	0773241531	2025-07-24 14:49:51.545314	2025-07-24 14:49:51.545314
29	IGHIL Lyna Malak	lililrina934@gmail.com	alumni	/default-profile.png	0660763505	2025-07-24 14:51:14.151132	2025-07-24 14:51:14.151132
26	AZZOUG Hania	azz.hania@gmail.com	membre rel-ex	/default-profile.png	0665904613	2025-07-24 14:48:04.876178	2025-07-24 14:48:04.876178
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, status, start_date, end_date, image_url, created_at, updated_at, site_url) FROM stdin;
\.


--
-- Name: admin_credits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_credits_id_seq', 3, true);


--
-- Name: admin_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_roles_id_seq', 5, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.members_id_seq', 29, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 1, false);


--
-- Name: admin_credits admin_credits_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_credits
    ADD CONSTRAINT admin_credits_email_key UNIQUE (email);


--
-- Name: admin_credits admin_credits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_credits
    ADD CONSTRAINT admin_credits_pkey PRIMARY KEY (id);


--
-- Name: admin_roles admin_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);


--
-- Name: admin_roles admin_roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_role_name_key UNIQUE (role_name);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: members members_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: admin_credits admin_credits_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_credits
    ADD CONSTRAINT admin_credits_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.admin_roles(id);


-- ✅ Add display_order column for member positioning (moved to end after all tables are created)
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS display_order INTEGER;

UPDATE public.members 
SET display_order = id 
WHERE display_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_members_display_order ON public.members(display_order);

COMMENT ON COLUMN public.members.display_order IS 'Used for custom ordering of members via drag and drop interface';

--
-- PostgreSQL database dump complete
--