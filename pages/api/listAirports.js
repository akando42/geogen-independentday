import axios from 'axios'
import { doc, getDoc, getDocs, collection, query } from "firebase/firestore"
import { db } from "@/libs/firebase"

export default async function handler(req, res) {
	const cities = []
	const q = query(collection(db, "airports"))
	const qsnap = await getDocs(q)

	qsnap.docs
		.map(d => cities.push({id: d.id, ...d.data()}))

	res.status(200).json({
		cities: cities, 
		message: "Pull Cities Airport Data"
	})
}