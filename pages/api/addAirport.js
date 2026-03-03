import axios from 'axios'
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore"
import { db } from "@/libs/firebase"

export default async function handler(req, res) {
	const data = req.body

	console.log("Add Airport to DB", db)

    const linkRef = await addDoc(
    	collection(db, "airports"),
    	{ 
    		city: data.city
    		// airport: data.airport 
    	}
    );

    const docId = linkRef.id;
    console.log("Insert to Database", data)

	res.status(200).json({
		docId: docId,
		data: data,
		message: "Insert Airport to Database"
	})

}