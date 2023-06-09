-- rambler up

CREATE OR REPLACE FUNCTION set_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$;

CREATE OR REPLACE FUNCTION audit_trigger()
    RETURNS TRIGGER
    AS $func$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            EXECUTE 'INSERT INTO ' || quote_ident(TG_TABLE_SCHEMA) || '.' || quote_ident(TG_TABLE_NAME || '_audit') || ' SELECT uuid_generate_v4(), ''' || TG_OP || ''', now(), user, $1.*' USING OLD;
        ELSE
            EXECUTE 'INSERT INTO ' || quote_ident(TG_TABLE_SCHEMA) || '.' || quote_ident(TG_TABLE_NAME || '_audit') || ' SELECT uuid_generate_v4(), ''' || TG_OP || ''', now(), user, $1.*' USING NEW;
        END IF;
        RETURN NULL;
    END;
$func$ LANGUAGE plpgsql;

-- rambler down

DROP FUNCTION IF EXISTS set_updated_at_column();

DROP FUNCTION IF EXISTS audit_trigger();
