
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id_usuario     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  correo         VARCHAR(150) NOT NULL,
  password_hash  VARCHAR(100) NOT NULL,   
  nombre         VARCHAR(100) NOT NULL,
  fecha_registro TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT uq_usuarios_correo UNIQUE (correo),
  CONSTRAINT ck_usuarios_correo_min CHECK (correo = lower(correo))
);

CREATE TABLE estudiantes (
  id_estudiante  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  documento      VARCHAR(30)  NOT NULL,
  nombres        VARCHAR(100) NOT NULL,
  apellidos      VARCHAR(100) NOT NULL,
  correo         VARCHAR(150) NOT NULL,
  fecha_registro TIMESTAMPTZ  NOT NULL DEFAULT now(),
  CONSTRAINT uq_estudiantes_documento UNIQUE (documento),
  CONSTRAINT uq_estudiantes_correo    UNIQUE (correo),
  CONSTRAINT ck_est_documento  CHECK (length(trim(documento)) > 0),
  CONSTRAINT ck_est_nombres    CHECK (length(trim(nombres))   > 0),
  CONSTRAINT ck_est_apellidos  CHECK (length(trim(apellidos)) > 0),
  CONSTRAINT ck_est_correo_fmt CHECK (correo ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  CONSTRAINT ck_est_correo_min CHECK (correo = lower(correo))
);


ALTER TABLE usuarios    ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

INSERT INTO estudiantes (documento, nombres, apellidos, correo) VALUES
 ('1001001001', 'Laura Camila',  'Gómez Ruiz',   'laura.gomez@ejemplo.com'),
 ('1001001002', 'Andrés Felipe', 'Marín Soto',   'andres.marin@ejemplo.com'),
 ('1001001003', 'Valentina',     'Ortiz Pérez',  'valentina.ortiz@ejemplo.com'),
 ('1001001004', 'Juan David',    'Castro Núñez', 'juan.castro@ejemplo.com');