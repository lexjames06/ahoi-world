import { NextResponse } from "next/server";
import { resetPasswordSchema } from "../utils/zod-schema";

export async function POST(req: Request, _res: Response) {
  const body = await req.json();
  console.log({body});
  
  const response = resetPasswordSchema.safeParse(body);
  console.log({response});

  if (!response.success) {
    const errors = response.error.format();

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}