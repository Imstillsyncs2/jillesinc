"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();

        if (username.trim() === "" || password.trim() === "") {
            setError("Username and password cannot be empty");
            return;
        }

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role: "TEACHER" }),
        });

        const data = await res.json();
        if (res.ok) {
            router.push("/login");
        } else {
            setError(data.error || "Signup failed");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSignup} className="bg-white p-6 shadow-md rounded">
                <h2 className="text-xl font-bold mb-4">Teacher Signup</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-2 w-full mb-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">Signup</button>
            </form>
        </div>
    );
}