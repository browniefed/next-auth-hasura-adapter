alter table "public"."accounts" drop constraint "accounts_user_id_fkey",
  add constraint "accounts_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete cascade;
