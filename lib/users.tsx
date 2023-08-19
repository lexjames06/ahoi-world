import { auth, firestore } from "@ahoi-world/firebase/app";
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
import { DocumentData, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { generateUserId } from "./utils/generate-UUIDV4";
import { Field, UserFormField } from "@ahoi-world/organisms/sign-in-or-register/types";
import { User } from "@ahoi-world/types/UserTypes";
import { getImage } from "./utils/get-image";

export type UserError = {
	hasError: true;
	path: Field | UserFormField;
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

const defaultProfileBackgroundImage = "/default-user/profile_background.jpg";

export const isUserError = (response: void | User | UserError): response is UserError => {
  return (response as UserError).hasError === true;
};

export const isUser = (response: void | User | UserError): response is User => {
  return (response as User).id !== undefined;
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
			console.log({ register: userCredential });
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

			console.log({ errorCode, errorMessage });

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
	return await confirmPasswordReset(auth, oobCode, password).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		console.log({ errorCode, errorMessage });

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
	return await sendPasswordResetEmail(auth, email).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		console.log({ errorCode, errorMessage });

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

	return await confirmPasswordReset(auth, oobCode, newPassword).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		console.log({ errorCode, errorMessage });

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
		const docSnapshots = await getDocs(q);
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
	const firestoreUser: User = {
		id: userId,
		uid: firebaseUser.uid,
		username: null,
		email: firebaseUser.email,
		displayName: firebaseUser.displayName,
		headline: null,
		bio: null,
		photoURL: firebaseUser.photoURL,
		backgroundImagePath: defaultProfileBackgroundImage,
		playlists: [],
		profileOptions: {
			showEmailButton: false,
			showHeadline: false,
		},
	};

	try {
		await setDoc(docRef, firestoreUser);

		const backgroundImagePath = getImage(defaultProfileBackgroundImage);

		return {
			...firestoreUser,
			backgroundImagePath,
		};
	} catch (error) {
		console.log({ error });
		return null;
	}
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
	const collectionRef = collection(firestore, "users");
	const q = query(collectionRef, where("username", "==", username));
	const querySnapshots = await getDocs(q);

	return !querySnapshots.docs.length;
}

export async function updateUser(user: User, userData: Partial<User>): Promise<UserError | User | void> {
	if (!user) {
		return defaultError;
	}

	const userDocRef = doc(firestore, "users", user.id);

	return await updateDoc(userDocRef, userData)
		.then(() => {
			const updated: User = {
				...user,
				...userData,
			};

			return updated;
		})
		.catch((error) => {
			console.log({error});
			console.log({code: error.code});
			console.log({message: error.message});
		});
}


export async function getUserProfileByUsername(username: string): Promise<User | null> {
	const usersRef = collection(firestore, "users");
	const q = query(usersRef, where("username", "==", username));

	try {
		const querySnapshots = await getDocs(q);
		const users: User[] = [];

		querySnapshots.forEach((doc) => {
			const data = doc.data() as User;
			const options = data.profileOptions;

			const user = {
				id: generateUserId(data.id),
				uid: data.uid,
				username: data.username,
				email: data.email,
				displayName: data.displayName,
				headline: data.headline,
				bio: data.bio,
				photoURL: data.photoURL,
				backgroundImagePath: defaultProfileBackgroundImage,
				playlists: data.playlists,
				profileOptions: options,
			};

			users.push(user);
		});

		return users[0] ?? null;
	} catch (error) {
		console.log({ error });
		return null;
	}
}