alter table "public"."verification_tokens" add constraint "verification_tokens_token_identifier_key" unique ("token", "identifier");
