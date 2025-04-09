"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const api_1 = require("@/services/api");
function LoginPage() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const router = (0, navigation_1.useRouter)();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api_1.default.post("/login", { email, password });
            localStorage.setItem("token", res.data.token);
            router.push("/home");
        }
        catch (err) {
            alert("Login failed");
        }
    };
    return (<div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
        <button type="button" className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => router.push("/register")}>
          Register
        </button>
      </form>
    </div>);
}
//# sourceMappingURL=page.js.map