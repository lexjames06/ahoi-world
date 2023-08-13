import { NextResponse } from "next/server";
import { signUpSchema } from "./utils/zod-schema";

export async function POST(req: Request, _res: Response) {
  const body = await req.json();
  console.log({body});

  const response = signUpSchema.safeParse(body);

  console.log({response});

  if (!response.success) {
    const errors = response.error.format();
    console.log({errors});
    console.log("sign-in");

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  const { email, password } = response.data;

  console.log({ email, password });

  return NextResponse.json({ message: "Success" }, { status: 200 });
}