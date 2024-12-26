import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Debtor } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * We interpret "debtor indexes" in arrays as referencing
 * brand-new Debtors in `body.debtors`,
 * where the first Debtor is index=0, second is index=1, etc.
 *
 * Example: "liabilities.debtors = [0, 1]" => connect to the first & second new Debtor.
 */
type RelegatedGroupRequestBody = {
  generalInformation: {
    rimNumber: string;
    branch: string;
    address1: string;
    address2: string;
    country: string;
    cautionCategory: string;
    cautionDate: string;
  };
  debtors: Array<{
    lastName: string;
    firstName: string;
    role: string;
    identification?: {
      passport?: string;
      driversPermit?: string;
      nationalID?: string;
    };
    employer: string;
    occupation: string;
  }>;
  liabilities: Array<{
    type: string;
    number: string;
    limitCurrency: string;
    limitValue: number;
    expiryDate: string;
    rate: number;
    liabilities: number;
    idcd: number;
    statuteBarred: string;
    debtors: number[];
  }>;
  securities: Array<{
    description: string;
    rstc: number;
    mv: number;
    use: string;
    demand: string;
    secures: string;
    advertised: boolean;
    dateAdvertised: string;
    valuation: number;
    debtors: number[];
  }>;
  unchargedAccounts: Array<{
    branch: string;
    type: string;
    accountNumber: string;
    balance: number;
    debtors: number[];
  }>;
  connectedAccounts: Array<{
    branch: string;
    type: string;
    accountNumber: string;
    balance: number;
    debtors: number[];
  }>;
};

export async function POST(req: NextRequest) {
  try {
    const body: RelegatedGroupRequestBody = await req.json();
    console.log("Received Body:", JSON.stringify(body, null, 2));

    const result = await prisma.$transaction(async (tx) => {
      // 1) Create the parent RelegatedGroup
      const group = await tx.relegatedGroup.create({
        data: {
          rimNumber: body.generalInformation.rimNumber,
        },
      });

      // 2) Create GeneralInformation
      const gi = await tx.generalInformation.create({
        data: {
          rimNumber: body.generalInformation.rimNumber,
          branch: body.generalInformation.branch,
          address1: body.generalInformation.address1,
          address2: body.generalInformation.address2,
          country: body.generalInformation.country,
          cautionCategory: body.generalInformation.cautionCategory,
          cautionDate: new Date(body.generalInformation.cautionDate),
          date: new Date(),
          status: "NEW",
        },
      });

      // 3) Link them by setting generalInformationId
      await tx.relegatedGroup.update({
        where: { rimNumber: group.rimNumber },
        data: {
          generalInformationId: gi.id,
        },
      });

      // 4) Create Debtors => store them in an array so we know their actual IDs
      const createdDebtors: Debtor[] = [];
      for (const d of body.debtors) {
        const newDebtor = await tx.debtor.create({
          data: {
            groupRimNumber: group.rimNumber,
            lastName: d.lastName,
            firstName: d.firstName,
            role: d.role,
            employer: d.employer,
            occupation: d.occupation,

            // Debtor fields directly:
            passport: d.identification?.passport,
            driversPermit: d.identification?.driversPermit,
            nationalID: d.identification?.nationalID,
          },
        });
        createdDebtors.push(newDebtor);
      }

      // Helper: transform "debtors": [0,1] => real IDs from createdDebtors
      function resolveDebtorIds(indexes: number[]): number[] {
        const realIds: number[] = [];
        for (const idx of indexes) {
          if (idx >= 0 && idx < createdDebtors.length) {
            realIds.push(createdDebtors[idx].id);
          }
          // else skip if out of range
        }
        return realIds;
      }

      // 5) Create Liabilities
      for (const liab of body.liabilities) {
        const debtorIds = resolveDebtorIds(liab.debtors);
        await tx.liability.create({
          data: {
            groupRimNumber: group.rimNumber,
            type: liab.type,
            number: liab.number,
            limitCurrency: liab.limitCurrency,
            limitValue: liab.limitValue,
            expiryDate: new Date(liab.expiryDate),
            rate: liab.rate,
            liabilities: liab.liabilities,
            idcd: liab.idcd,
            statuteBarred: new Date(liab.statuteBarred),
            ...(debtorIds.length
              ? {
                  debtors: {
                    connect: debtorIds.map((did) => ({ id: did })),
                  },
                }
              : {}),
          },
        });
      }

      // 6) Create Securities
      for (const sec of body.securities) {
        const debtorIds = resolveDebtorIds(sec.debtors);
        await tx.security.create({
          data: {
            groupRimNumber: group.rimNumber,
            description: sec.description,
            rstc: sec.rstc,
            mv: sec.mv,
            use: sec.use,
            demand: sec.demand,
            secures: sec.secures,
            advertised: sec.advertised,
            dateAdvertised: new Date(sec.dateAdvertised),
            valuation: new Date(sec.dateAdvertised),
            ...(debtorIds.length
              ? {
                  debtors: {
                    connect: debtorIds.map((did) => ({ id: did })),
                  },
                }
              : {}),
          },
        });
      }

      // 7) Create Uncharged Accounts
      for (const acct of body.unchargedAccounts) {
        const debtorIds = resolveDebtorIds(acct.debtors);
        await tx.account.create({
          data: {
            unchargedGroupId: group.rimNumber,
            branch: acct.branch,
            type: acct.type,
            accountNumber: acct.accountNumber,
            balance: acct.balance,
            ...(debtorIds.length
              ? {
                  debtors: {
                    connect: debtorIds.map((did) => ({ id: did })),
                  },
                }
              : {}),
          },
        });
      }

      // 8) Create Connected Accounts
      for (const acct of body.connectedAccounts) {
        const debtorIds = resolveDebtorIds(acct.debtors);
        await tx.account.create({
          data: {
            connectedGroupId: group.rimNumber,
            branch: acct.branch,
            type: acct.type,
            accountNumber: acct.accountNumber,
            balance: acct.balance,
            ...(debtorIds.length
              ? {
                  debtors: {
                    connect: debtorIds.map((did) => ({ id: did })),
                  },
                }
              : {}),
          },
        });
      }

      // 9) Return the newly formed record
      //    with includes if you want (like generalInformation, etc.)
      const finalGroup = await tx.relegatedGroup.findUnique({
        where: { rimNumber: group.rimNumber },
        include: {
          generalInformation: true,
          debtors: true,
          liabilities: true,
          securities: true,
          unchargedAccounts: true,
          connectedAccounts: true,
        },
      });

      return finalGroup;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("POST /relegatedGroups error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
