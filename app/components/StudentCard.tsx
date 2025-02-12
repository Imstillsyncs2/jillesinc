"use client";

import { useState } from "react";

interface Student {
    id: string;
    name: string;
    username: string;
    jbucks: number;
}

const StudentCard = ({ student }: { student: Student }) => {
    const [points, setPoints] = useState(0);

    const handleAddPoints = async () => {
        if (points <= 0) return;

        const response = await fetch("/api/jbucks", {
            method: "POST",
            body: JSON.stringify({ studentId: student.id, points }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert(`${points} J-Bucks added to ${student.name}`);
            setPoints(0);
        } else {
            alert("Failed to add points");
        }
    };

    return (
        <div className="p-4 border rounded shadow-md">
            <h3 className="font-bold">{student.name}</h3>
            <p>@{student.username}</p>
            <p>J-Bucks: {student.jbucks}</p>

            <div className="mt-2">
                <input
                    type="number"
                    value={points}
                    min="1"
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="p-2 border rounded"
                    placeholder="Add points"
                />
                <button onClick={handleAddPoints} className="ml-2 bg-blue-500 text-white p-2 rounded">
                    Add Points
                </button>
            </div>
        </div>
    );
};

export default StudentCard;