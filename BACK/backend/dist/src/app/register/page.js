'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const api_1 = require("@/services/api");
function RegisterPage() {
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await (0, api_1.register)(email, name, password);
            alert('Usuario registrado exitosamente');
            router.push('/');
        }
        catch (err) {
            console.error(err);
            alert('Error al registrar usuario');
        }
    };
    return (<div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-80">
        <input className="border p-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} type="text" required/>
        <input className="border p-2" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required/>
        <input className="border p-2" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required/>
        <button className="bg-green-600 text-white p-2 rounded" type="submit">
          Registrarse
        </button>
      </form>
    </div>);
}
//# sourceMappingURL=page.js.map