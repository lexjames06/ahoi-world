import { NextResponse } from "next/server";
import { signUpSchema } from "../utils/zod-schema";

export async function POST(req: Request, _res: Response) {
  const body = await req.json();
  console.log({req});
  console.log({body});

  const response = signUpSchema.safeParse(body);

  console.log({response});

  if (!response.success) {
    const errors = response.error.format();
    console.log("register");
    console.log({errors});

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  const { email, password, confirmPassword } = response.data;

  console.log({ email, password, confirmPassword });

  return NextResponse.json({ message: "Success" }, { status: 200 });
}