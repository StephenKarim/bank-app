/* File: /src/app/api/ccuClassifiedDebts/route.ts */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// You could import type RelegatedGroup, Liability if needed for custom types
// import type { RelegatedGroup, Liability } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1) Fetch all RelegatedGroups
    const rawGroups = await prisma.relegatedGroup.findMany({
      include: {
        generalInformation: true,
        debtors: {
          take: 1, // only the first Debtor
          orderBy: { id: "asc" },
        },
        liabilities: true, // we'll sum 'liabilities' field from each
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 2) Compute total liabilities
    const groupsWithTotals = rawGroups.map((g) => {
      const totalLiabilities = g.liabilities.reduce((acc, item) => {
        // Summation of `item.liabilities`
        return acc + (item.liabilities ?? 0);
      }, 0);

      return {
        ...g,
        totalLiabilities,
      };
    });

    return NextResponse.json({
      success: true,
      data: groupsWithTotals,
    });
  } catch (error) {
    console.error("/GET ccuClassifiedDebts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
