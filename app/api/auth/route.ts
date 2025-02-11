import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
	try {
		const { action, name, username, password } = await req.json();

		if (action === "signup") {
			// Check if username exists
			const existingUser = await prisma.user.findUnique({ where: { username } });
			if (existingUser) {
				return NextResponse.json({ error: "Username already exists" }, { status: 400 });
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create user
			const user = await prisma.user.create({
				data: { name, username, password: hashedPassword },
			});

			return NextResponse.json({ message: "User created", user }, { status: 201 });
		}

		if (action === "login") {
			// Find user
			const user = await prisma.user.findUnique({ where: { username } });
			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 401 });
			}

			// Check password
			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
				return NextResponse.json({ error: "Invalid password" }, { status: 401 });
			}

			// Generate JWT
			const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

			return NextResponse.json({ 
				token, 
				name: user.name, 
				points: user.points, 
				message: "Login successful" 
			}, { status: 200 });
		}

		return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	} catch (error) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}