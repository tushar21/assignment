import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get("filter");

        let result;

        switch (filter) {
            case "averages":
                result = await prisma.$queryRaw`
          SELECT class, ROUND(AVG(grade), 2) as grade
          FROM "Grades"
          GROUP BY class
        `;
                break;
            case "passing":
                result = await prisma.$queryRaw`
          SELECT class, ROUND(AVG(grade), 2) as grade
          FROM "Grades"
          GROUP BY class
          HAVING AVG(grade) > 55
        `;
                break;
            case "highperforming":
                result = await prisma.$queryRaw`
          SELECT class, ROUND(AVG(grade), 2) as grade
          FROM "Grades"
          GROUP BY class
          HAVING AVG(grade) > 70
        `;
                break;
            case "all":
            default:
                result = await prisma.$queryRaw`
          SELECT * FROM "Grades"
        `;
                break;
        }

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json(
            { message: "Failed to fetch grades", error: String(err) },
            { status: 500 }
        );
    }
};


export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const { sub, grade } = body;

        const createdGrade = {
            class: sub,
            grade: grade,
        }
        await prisma.$queryRaw`
    INSERT INTO "Grades" (class, grade)
    VALUES (${sub}::"Class", ${grade})`

        return new NextResponse(
            JSON.stringify({ message: "Grade is created", createdGrade }),
            { status: 201 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating grade",
                error: error instanceof Error ? error.message : error,
            }),
            {
                status: 500,
            }
        );
    }
};
