alter table "public"."accounts" add constraint "accounts_provider_providerAccountId_key" unique ("provider", "providerAccountId");
