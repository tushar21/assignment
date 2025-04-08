import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const getAllNubers: any = await prisma.$queryRaw`select  * from "Numbers" n`
        console.log(typeof getAllNubers, "getAllNubers")

        const resultArray: any = []

        getAllNubers.forEach((item: any, index: any) => {
            resultArray.push(
                {
                    ID1: item.id,
                    number1: item.value,
                    ID2: getAllNubers[index + 1] && getAllNubers[index + 1]['id'] ? getAllNubers[index + 1]['id'] : null,
                    number2: getAllNubers[index + 1] && getAllNubers[index + 1]['value'] ? getAllNubers[index + 1]['value'] : null,
                    sum: item.value + (getAllNubers[index + 1] && getAllNubers[index + 1]['value'] ? getAllNubers[index + 1]['value'] : 0)
                }
            )
        });
        

        if(resultArray.length > 1) {resultArray.pop()}

        return new NextResponse(JSON.stringify(resultArray), { status: 200 });
    } catch (error) {
        return new NextResponse("Error in fetching users" + error, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        const number = body['number']

        const getLatestId: any = await prisma.$queryRaw`select id from "Numbers" n order by id desc limit 1`
        console.log(getLatestId, getLatestId)
        const latestId = getLatestId.length == 0 ? 1 : getLatestId[0]['id'] + 1

        console.log(latestId, "latestId")
        const createNumber = await prisma.$queryRaw`
        INSERT INTO "Numbers" (id, value)
        VALUES (${latestId}, ${number})
      `;

        return new NextResponse(
            JSON.stringify({ message: "Number is created" }),
            { status: 201 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error in creating user",
                error,
            }),
            {
                status: 500,
            }
        );
    }
};