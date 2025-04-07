'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, name, password);
      alert('Usuario registrado exitosamente');
      router.push('/'); // redirige al login
    } catch (err: any) {
      console.error(err);
      alert('Error al registrar usuario');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-80">
        <input
          className="border p-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
        />
        <input
          className="border p-2"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="border p-2"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button className="bg-green-600 text-white p-2 rounded" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
}
