--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-10-11 03:39:32

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
-- TOC entry 858 (class 1247 OID 112097)
-- Name: users_language_preference_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_language_preference_enum AS ENUM (
    'en',
    'ar',
    'hi'
);


ALTER TYPE public.users_language_preference_enum OWNER TO postgres;

--
-- TOC entry 855 (class 1247 OID 112089)
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'admin',
    'business_owner',
    'team_member'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 112052)
-- Name: auth_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_users (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public.auth_users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 112051)
-- Name: auth_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_users_id_seq OWNER TO postgres;

--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 217
-- Name: auth_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_users_id_seq OWNED BY public.auth_users.id;


--
-- TOC entry 220 (class 1259 OID 112067)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    role public.users_role_enum DEFAULT 'team_member'::public.users_role_enum NOT NULL,
    language_preference public.users_language_preference_enum DEFAULT 'en'::public.users_language_preference_enum NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 112066)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4652 (class 2604 OID 112055)
-- Name: auth_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_users ALTER COLUMN id SET DEFAULT nextval('public.auth_users_id_seq'::regclass);


--
-- TOC entry 4653 (class 2604 OID 112070)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4817 (class 0 OID 112052)
-- Dependencies: 218
-- Data for Name: auth_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_users (id, email, password) FROM stdin;
1	test@example.com	$2b$10$TledWFhDd7U.MdFIWh3fsOlXln8/8RPWMMmGrVphte1LD.Qs10cJG
\.


--
-- TOC entry 4819 (class 0 OID 112067)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, uuid, full_name, email, phone, password_hash, created_at, updated_at, role, language_preference) FROM stdin;
1	d8e848c2-901f-46de-8637-2dedbb3eb179	Hasan Khan	hasan@example.com	+8801700000000	$2b$10$5D14bnKB7RGi9fOwtCHIHeXvl4HH72aKSp1SukNzhSp04IadZ/6J6	2025-10-11 03:34:01.207907	2025-10-11 03:34:01.207907	business_owner	en
3	0ffd45e3-aca9-474c-8578-9c529c62c10f	Hasan Khan	hasan@gmail.com	+88017003200	$2b$10$8tUkJmExdq1O3d8iQ/WD/evWmoIGQzB6ifty8SmQIsFE9AhpdGEXq	2025-10-11 03:34:42.136521	2025-10-11 03:34:42.136521	business_owner	en
\.


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 217
-- Name: auth_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_users_id_seq', 1, true);


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4660 (class 2606 OID 112059)
-- Name: auth_users PK_c88cc8077366b470dafc2917366; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT "PK_c88cc8077366b470dafc2917366" PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 112061)
-- Name: auth_users UQ_13d8b49e55a8b06bee6bbc828fb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT "UQ_13d8b49e55a8b06bee6bbc828fb" UNIQUE (email);


--
-- TOC entry 4664 (class 2606 OID 112084)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4666 (class 2606 OID 112086)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4668 (class 2606 OID 112080)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4670 (class 2606 OID 112082)
-- Name: users users_uuid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uuid_key UNIQUE (uuid);


-- Completed on 2025-10-11 03:39:33

--
-- PostgreSQL database dump complete
--

