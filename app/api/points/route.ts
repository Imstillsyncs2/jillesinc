import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	try {
		const { username, amount } = await req.json();

		// Find the user
		const user = await prisma.user.findUnique({ where: { username } });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Update points
		await prisma.user.update({
			where: { username },
			data: { points: user.points + amount },
		});

		// Log transaction
		await prisma.transaction.create({
			data: {
				userId: user.id,
				amount,
			},
		});

		return NextResponse.json({ message: "Points added successfully" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const username = searchParams.get("username");

		if (!username) {
			return NextResponse.json({ error: "Username required" }, { status: 400 });
		}

		// Fetch transactions
		const transactions = await prisma.transaction.findMany({
			where: { user: { username } },
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({ transactions }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}