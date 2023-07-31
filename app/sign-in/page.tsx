import UserAccessForm from "../components/sign-in-or-register/layout";
import { FormType } from "../components/sign-in-or-register/types";

export function generateMetadata() {
	return { title: "Sign In" };
}

export default async function SignIn() {
  return (
    <UserAccessForm
      type={FormType.SIGN_IN}
      header="AHOI"
      subHeader="Welcome back to the House"
    />
  );
}
