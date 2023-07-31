import UserAccessForm from "../components/sign-in-or-register/layout";
import { FormType } from "../components/sign-in-or-register/types";

export function generateMetadata() {
	return { title: "Register" };
}

export default async function Register() {
  return (
    <UserAccessForm
      type={FormType.REGISTER}
      header="AHOI"
      subHeader="Welcome to the House"
    />
  );
}
