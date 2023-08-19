import { NextResponse } from "next/server";
import { createUsernameSchema } from "./utils/zod-schema";
import { isUserError, isUsernameAvailable, updateUser } from "@ahoi-world/lib/users";

export async function POST(req: Request, _res: Response) {
  const body = await req.json();
  
  const response = createUsernameSchema.safeParse({ username: body.username });

  if (!response.success) {
    const errors = response.error.format();

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }
  const { username } = response.data;
  const available = await isUsernameAvailable(username);

  if (!available) {
    const errors = {
      username: {
        _errors: ["The username is already in use"],
      },
    };

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  const updateResponse = await updateUser(body.user, { username });

  if (isUserError(updateResponse) && updateResponse.hasError) {
    const errors = {
      [updateResponse.path]: {
        _errors: [updateResponse.message],
      },
    };

    return NextResponse.json({
      error: { message: "Invalid Request", errors },
    }, {
      status: 400,
    });
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}