import axios from 'axios'
import { 
	doc, query, where, getDocs, updateDoc, collection, increment 
} from "firebase/firestore"

import { db } from "@/libs/firebase"

export default async function handler(req, res) {
	const data = req.body

	const airportRef = collection(db, "airports");

	const q = query(
  		airportRef,
  		where("city", "==", data.city)
	);

	const snapshot = await getDocs(q);
	if (snapshot.empty) {
	  	res.status(200).json({
			message: "NO Matching City Found"
		})
	}

	const docSnap = snapshot.docs[0];
	const cityRef = docSnap.ref;
	const cityData = docSnap.data()

	await updateDoc(cityRef, {
		airport : data.airportCode 
	});

	res.status(200).json({
		message: "Airport Code Added",
		data: data
	})
}