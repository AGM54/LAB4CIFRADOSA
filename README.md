# LAB4CIFRADOSA

Laboratorio 4 - Cifrados Asimétricos  
Este laboratorio implementa distintos esquemas de cifrado y firma digital, incluyendo **RSA** y **ECC**, además de herramientas para **verificación de integridad**, **cifrado de archivos** y **uso de JWTs** para autenticación.

## Tecnologías Utilizadas

# FRONTEND
- **React**
- **NextJS** 


## Estructura del Proyecto

```
src/
├── app/home               # Módulo de autenticación
├── file/               # Manejo seguro de archivos
├── prisma/             # Esquema de base de datos
└── main.ts             # Punto de entrada
```

---


# BACKEND
- **NestJS** – Backend API
- **Prisma ORM** – Base de datos (PostgreSQL)
- **JWT** – Autenticación
- **Criptografía** – RSA, ECC, SHA-256, AES
- **TypeScript**

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

---

## Endpoints de prueba

Puedes usar herramientas como **Postman** o **Insomnia** o bien **ThunderClient** en VSCode para probar los siguientes endpoints:

| Método | Ruta                     | Descripción                          |
|--------|--------------------------|--------------------------------------|
| POST   | `/login`                 | Iniciar sesión y obtener token JWT   |
| POST   | `/register`              | Registra nuevo usuario               |
| POST   | `/file/guardar`          | Permite subir un archivo             |
| POST   | `/file/verificar`        | Validacion de un archivo cifrado     |
| POST   | `/file/archivos`         | Obtencion de todos los archivos      |
| POST   | `/file/:id/descargar`    | Descarga archivo especifico          |
| POST   | `/user/publicKey`        | Validar que el usuario es quien subio|
|--------|--------------------------|--------------------------------------|

> Requieren autenticación con JWT (excepto `/login`).

---

## Estructura del Proyecto

```
src/
├── auth/               # Módulo de autenticación
├── file/               # Manejo seguro de archivos
├── prisma/             # Esquema de base de datos
└── main.ts             # Punto de entrada
```

---

## Requisitos

- Node.js >= 18.x
- npm >= 9.x
- SQLite (incluido por Prisma)

---
