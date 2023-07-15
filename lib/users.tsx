import { firestore } from "@/firebase/app";
import { doc, getDoc } from "firebase/firestore";

export async function getFirebaseUserData(userId: string): Promise<User|null> {
	const docRef = doc(firestore, "users", userId);
  try {
    const docSnapshot = await getDoc(docRef);
    const user = docSnapshot.data() as User;
    return user;
  } catch (error) {
    console.log({error});
    return null;
  }
}
