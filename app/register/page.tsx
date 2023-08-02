import UserAccessForm from "../pages/sign-in-or-register/form-layout";
import { FormType } from "../pages/sign-in-or-register/types";

export function generateMetadata() {
	return { title: "Register" };
}

export default async function Register() {
	return <UserAccessForm type={FormType.REGISTER} header="AHOI" subHeader="Welcome to the House" />;
}
