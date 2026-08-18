import { useState } from "react";
import { supabase } from "../../supabaseClient";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

        async function handleLogin(event) {
            event.preventDefault();
            setMessage("");
    
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
    
            if (error) {
                setMessage(error.message);
                return;
            }
    
            setMessage("Successfully signed in.");
        }

    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin</h1>

            <form onSubmit={handleLogin} className="max-w-md space-y-4">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border rounded p-2"
                required
            />

            <button
                type="submit"
                className="border rounded px-4 py-2 cursor-pointer"
            >
                Sign In
            </button>

            {message && <p>{message}</p>}
            </form>
        </main>
    );
}

export default AdminLogin;