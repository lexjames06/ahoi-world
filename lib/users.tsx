import { auth, firestore } from "@/firebase/app";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	UserCredential,
	User as FirebaseUser,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	confirmPasswordReset,
	verifyPasswordResetCode,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { generateUserId } from "./utils/generate-UUIDV4";
import { Field } from "@/app/components/sign-in-or-register/types";

export type UserError = {
	hasError: true;
	path: Field;
	message: string;
};

export type UserResponse =
	| {
			hasError: false;
			userCredential: UserCredential;
	  }
	| UserError;

const provider = new GoogleAuthProvider();

const defaultError: UserError = {
	hasError: true,
	path: Field.FORM,
	message: "Something went wrong, please try again",
};

export const googleLogIn = () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);

			if (!credential) {
				throw Error("No user credential");
			}
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			console.log({ errorCode });

			const errorMessage = error.message;
			console.log({ errorMessage });
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
};

export function signout() {
	auth
		.signOut()
		.then(() => {
			console.log("signed out");
		})
		.catch((error) => console.log({ error }));
}

export async function createUserWithEmailPassword(email: string, password: string): Promise<UserResponse> {
	return await createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			console.log({register: userCredential})
			return {
				hasError: false as const,
				userCredential,
			};
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			console.log({ errorCode, errorMessage });

			if (errorCode === "auth/email-already-in-use") {
				return {
					hasError: true,
					path: Field.EMAIL,
					message: "There is already an account with this email",
				};
			}

			return defaultError;
			// TODO: introduce error handling
		});
}

export async function signInWithEmailPassword(email: string, password: string): Promise<UserResponse> {
	return await signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			return {
				hasError: false as const,
				userCredential,
			};
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			console.log({errorCode, errorMessage});

			if (errorCode === "auth/wrong-password") {
				return {
					hasError: true,
					path: Field.FORM,
					message: "The email or password is incorrect",
				};
			}

			// TODO: introduce error handling

			return defaultError;
		});
}

export async function resetPassword(oobCode: string, password: string): Promise<UserError | void> {
	return await confirmPasswordReset(auth, oobCode, password)
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			console.log({errorCode, errorMessage});

			if (errorCode === "auth/invalid-action-code") {
				return {
					hasError: true,
					path: Field.FORM,
					message: "It looks like this link has expired.\nTry requesting a new code.",
				};
			}

			return defaultError;
		});
}

export async function sendResetPasswordEmail(email: string): Promise<UserError | void> {
	return await sendPasswordResetEmail(auth, email)
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			console.log({errorCode, errorMessage});

			if (errorCode === "auth/user-not-found") {
				return {
					hasError: true,
					path: Field.FORM,
					message: "There was no account found with this email",
				};
			}

			// TODO: introduce error handling

			return defaultError;
		});
}

export async function confirmUserPasswordReset(oobCode: string, newPassword: string) {
	if (!oobCode && !newPassword) {
		return;
	}

	return await confirmPasswordReset(auth, oobCode, newPassword)
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;

			console.log({errorCode, errorMessage});

			// TODO: introduce error handling

			return defaultError;
		});
}

export function getCurrentUser() {
	return auth.currentUser;
}

export async function getFirebaseUserData({
	userId,
	firebaseUID,
}: {
	userId?: string;
	firebaseUID?: string;
}): Promise<User | null> {
	if (userId) {
		return await getFirebaseUserByUserId(userId);
	}

	if (firebaseUID) {
		return await getFirebaseUserByFirebaseUID(firebaseUID);
	}

	return null;
}

async function getFirebaseUserByUserId(userId: string): Promise<User | null> {
	const docRef = doc(firestore, "users", userId);
	try {
		const docSnapshot = await getDoc(docRef);
		const user = docSnapshot.data() as User;
		return user;
	} catch (error) {
		console.log({ error });
		return null;
	}
}

async function getFirebaseUserByFirebaseUID(firebaseUID: string): Promise<User | null> {
	const collectionRef = collection(firestore, "users");
	const q = query(collectionRef, where("uid", "==", firebaseUID));

	try {
		console.log("trying")
		const docSnapshots = await getDocs(q);
		console.log({docSnapshots});
		const users: User[] = [];
		docSnapshots?.forEach((doc) => users.push(doc.data() as User));
		return users?.[0] ?? null;
	} catch (error) {
		console.log({ error });
		return null;
	}
}

export async function createFirebaseUser(firebaseUser: FirebaseUser): Promise<User | null> {
	const userId = generateUserId();
	const docRef = doc(firestore, "users", userId);
	const firestoreUser = {
		id: userId,
		uid: firebaseUser.uid,
		username: null,
		email: firebaseUser.email,
		displayName: firebaseUser.displayName,
		job: null,
		bio: null,
		photoURL: firebaseUser.photoURL,
	};

	try {
		await setDoc(docRef, firestoreUser);
		return firestoreUser;
	} catch (error) {
		console.log({ error });
		return null;
	}
}
