# Next Auth Hasura Adapter

This probably doesn't work. I didn't try it.

## Migration

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text, "email" text, "emailVerified" timestamptz NOT NULL, "image" text, PRIMARY KEY ("id") , UNIQUE ("email"));
CREATE TABLE "public"."sessions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "sessionToken" text NOT NULL, "expires" timestamptz NOT NULL, "userId" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
CREATE TABLE "public"."verification_tokens" ("token" text NOT NULL, "expires" timestamptz NOT NULL, "identifier" text NOT NULL, PRIMARY KEY ("token") );
CREATE TABLE "public"."accounts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "type" text NOT NULL, "provider" text NOT NULL, "providerAccountId" text NOT NULL, "refresh_token" text, "access_token" text, "expires_at" bigint, "token_type" text, "scope" text, "id_token" text, "session_state" text, "oauth_token_secret" text, "oauth_token" text, "user_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
```
