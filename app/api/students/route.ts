import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// POST: Add a new student to a class
export async function POST(req: NextRequest) {
    try {
        const { name, username, classId } = await req.json();

        // Check if student exists
        const studentExists = await prisma.student.findUnique({ where: { username } });

        if (studentExists) {
            return NextResponse.json({ error: "Student already exists" }, { status: 400 });
        }

        const student = await prisma.student.create({
            data: {
                name,
                username,
                classId, // Connect using ID instead of class name
            },
        });

        return NextResponse.json(student, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET: Fetch students in a class
export async function GET(req: NextRequest) {
    try {
        const classId = req.nextUrl.searchParams.get("classId");

        if (!classId) {
            return NextResponse.json({ error: "Missing classId parameter" }, { status: 400 });
        }

        const students = await prisma.student.findMany({
            where: { classId },
        });

        return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}