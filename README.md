- ASTRID MARIE GLAUSER OLIVA - 21299
- JOSUE SAMUEL ARGUETA HERNANDEZ - 211024

# LAB4CIFRADOSA

Laboratorio 4 - Cifrados Asimétricos  
Este laboratorio implementa distintos esquemas de cifrado y firma digital, incluyendo **RSA** y **ECC**, además de herramientas para **verificación de integridad**, **cifrado de archivos** y **uso de JWTs** para autenticación.

## Tecnologías Utilizadas

# FRONTEND

- **Next.js**: Framework React para la creación del frontend.
- **Tailwind CSS**: Estilización rápida y moderna de componentes.
- **Web Crypto API**: Usada para generar claves públicas/privadas y realizar firmas digitales (RSA/ECC).
- **JavaScript/TypeScript**: Lógica del cliente y tipos estáticos.
- **localStorage**: Guarda el JWT y la clave pública del usuario.
- **Hooks (`useState`, `useEffect`)**: Para manejar el estado y ciclos de vida.

## Estructura del Proyecto

```
src/
├── app/home            # Módulo Inicio de la pagina
├── app/register        # Registro de nuevo usuario
├── service             # Conexion al backend
├── utils               # Encriptacion, subida de archivos
└── main.ts             # Punto de entrada
```

---

# BACKEND

- **NestJS**: Framework robusto para construir APIs seguras y escalables.
- **JWT (jsonwebtoken)**: Usado para generar y validar tokens de autenticación.
- **bcrypt**: Protege las contraseñas con hashing y salt.
- **Prisma ORM**: Comunicación con la base de datos PostgreSQL.
- **PostgreSQL**: Base de datos relacional usada para guardar usuarios, archivos, claves, etc.
- **crypto (Node.js)**: Para verificar firmas y generar hashes SHA-256.
- **elliptic + asn1.js**: Librerías para manejar la verificación ECC.

---

## Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/AGM54/LAB4CIFRADOSA.git
cd LAB4CIFRADOSA
```

**Instala las dependecias FRONTED**

```bash
cd FRONT/frontend
npm install
```

**Inicializacion del servicion**

```bash
npm run dev
```

> El servidor arrancará por defecto en `http://localhost:3001`. Tomar en cuenta correr el BACKEND primero.

**Instala las dependencias BACKEND:**

```bash
npm install
```

3. **Configura la base de datos (SQLite con Prisma):**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Inicia el servidor:**

```bash
npm run start:dev
```

> El servidor arrancará por defecto en `http://localhost:3000`.

---

## Funcionalidades Clave

- **Generación de claves RSA y ECC**
- **Firma y verificación digital**
- **Cifrado y descifrado de archivos**
- **Hashing con SHA-256**
- **Autenticación basada en JWT**
- **Endpoints seguros para manejo de archivos**

1. **Registro y Login**:

   - El usuario se registra con email, nombre y contraseña.
   - La contraseña se guarda en la base de datos de forma segura con `bcrypt`.

2. **JWT (JSON Web Tokens)**:

   - Al iniciar sesión, se genera un token JWT firmado.
   - El token contiene el ID y correo del usuario y expira en 1 hora.
   - Se guarda en `localStorage` y se envía en cada request (en headers).

3. **Generación de Llaves**:

   - Los usuarios generan un par de llaves (privada y pública) con Web Crypto.
   - La **privada** se descarga en `.pem`, la **pública** se envía al backend.

4. **Firma Digital**:

   - El usuario selecciona un archivo, genera su hash (`SHA-256`) y firma con su clave privada.
   - Firma generada:
     - **RSA**: sobre el hash del archivo.
     - **ECC**: sobre el contenido completo.
   - El archivo, su firma y hash son enviados al backend.

5. **Verificación de Firma**:

   - El backend obtiene la clave pública del usuario y verifica la firma.
   - Para ECC: decodifica la firma DER (`r` y `s`), usa `elliptic` para verificar.
   - Para RSA: verifica usando `crypto.createVerify`.

6. **Protección de integridad (Hash SHA-256)**:

   - Se genera el hash en el frontend y se guarda junto con el archivo.
   - El backend recalcula el hash para verificar la integridad del contenido.

7. **Cifrado del archivo** (opcional - extra):
   - Los archivos podrían cifrarse con la clave pública antes de enviarse (RSA).
   - Actualmente el archivo se guarda en binario sin cifrado explícito (solo firmado y con hash).

---

---

## Endpoints de prueba

Puedes usar herramientas como **Postman** o **Insomnia** o bien **ThunderClient** en VSCode para probar los siguientes endpoints:

| Método   | Ruta                       | Descripción                            |
| -------- | -------------------------- | -------------------------------------- |
| POST     | `/login`                   | Iniciar sesión y obtener token JWT     |
| POST     | `/register`                | Registra nuevo usuario                 |
| POST     | `/file/guardar`            | Permite subir un archivo               |
| POST     | `/file/verificar`          | Validacion de un archivo cifrado       |
| POST     | `/file/archivos`           | Obtencion de todos los archivos        |
| POST     | `/file/:id/descargar`      | Descarga archivo especifico            |
| POST     | `/user/publicKey`          | Validar que el usuario es quien subio  |
| -------- | -------------------------- | -------------------------------------- |

> Requieren autenticación con JWT (excepto `/login`).

---

## Estructura del Proyecto

```
src/
├── auth/               # Módulo de autenticación
├── file/               # Manejo seguro de archivos
├── prisma/             # Esquema de base de datos
├── user/               # Validacion de cifrado segun la llave del usuario actual
└── main.ts             # Punto de entrada
```

---

## Requisitos

- Node.js >= 18.x
- npm >= 9.x
- SQLite (incluido por Prisma)

---
