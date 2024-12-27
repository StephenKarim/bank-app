import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Default page size
const DEFAULT_PAGE_SIZE = 10;

// Fields allowed for sorting
const ALLOWED_SORT_FIELDS = ["createdAt", "rimNumber", "branch"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const take = parseInt(
      searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE),
      10
    );
    const skip = (page - 1) * take;

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") ||
      "desc") as Prisma.SortOrder;
    const orderByField = ALLOWED_SORT_FIELDS.includes(sortBy)
      ? sortBy
      : "createdAt";

    // Simple filtering by rimNumber or branch
    const filter = searchParams.get("filter") || "";

    // Count total for pagination
    const totalCount = await prisma.relegatedGroup.count({
      where: {
        OR: [
          { rimNumber: { contains: filter, mode: "insensitive" } },
          {
            generalInformation: {
              branch: { contains: filter, mode: "insensitive" },
            },
          },
        ],
      },
    });

    // Fetch matching rows
    const rawGroups = await prisma.relegatedGroup.findMany({
      skip,
      take,
      where: {
        OR: [
          { rimNumber: { contains: filter, mode: "insensitive" } },
          {
            generalInformation: {
              branch: { contains: filter, mode: "insensitive" },
            },
          },
        ],
      },
      orderBy: {
        [orderByField]: sortOrder,
      },
      include: {
        generalInformation: true,
        debtors: true,
        liabilities: true,
        securities: true,
        unchargedAccounts: true,
        connectedAccounts: true,
      },
    });

    // Compute any aggregates (totalLiabilities, totalSecuritiesValue, etc.)
    const groupsWithAggregates = rawGroups.map((group) => {
      const totalLiabilities = group.liabilities.reduce(
        (sum, li) => sum + (li.liabilities || 0),
        0
      );

      const totalSecuritiesValue = group.securities.reduce(
        (sum, sec) => sum + (sec.mv || 0),
        0
      );

      // total # of accounts
      const totalAccounts =
        (group.unchargedAccounts?.length || 0) +
        (group.connectedAccounts?.length || 0);

      return {
        ...group,
        totalLiabilities,
        totalSecuritiesValue,
        totalAccounts,
      };
    });

    // Return data + pagination metadata
    return NextResponse.json({
      success: true,
      data: groupsWithAggregates,
      meta: {
        page,
        pageSize: take,
        totalCount,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error("GET /ccuClassifiedDebts Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
