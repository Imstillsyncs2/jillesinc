"use client";

import { useState, useEffect } from "react";
import StudentCard from "./components/StudentCard";

interface Student {
    id: string;
    name: string;
    username: string;
    jbucks: number;
}

const Students = ({ classId }: { classId: string }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`/api/students?classId=${classId}`);
                const data = await response.json();
                setStudents(data.students);
            } catch (error) {
                console.error("Failed to fetch students", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [classId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {students.map((student) => (
                <StudentCard key={student.id} student={student} />
            ))}
        </div>
    );
};

export default Students;