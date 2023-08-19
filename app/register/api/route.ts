import { NextResponse } from "next/server";
import { signUpSchema } from "../utils/zod-schema";

export async function POST(req: Request, _res: Response) {
  const body = await req.json();

  const response = signUpSchema.safeParse(body);

  if (!response.success) {
    const errors = response.error.format();

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  const { email, password, confirmPassword } = response.data;

  return NextResponse.json({ message: "Success" }, { status: 200 });
}