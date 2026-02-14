import axios from 'axios'

export default async function handler(req, res) {
	let bookingPayload = req.body
	let response = await axios.get(
		"https://booking-com15.p.rapidapi.com/api/v1/flights/getMinPrice",
		{	
			params: bookingPayload,
			headers: {
              "x-rapidapi-key": "0723996e51mshf188c3b5271df8ep163c94jsna1d1ebb9bc9a",
              "x-rapidapi-host": "booking-com15.p.rapidapi.com",
            },
            withCredentials: true,
		}
	)

	let flights = response.data.data
	// console.log("FLIGHTS ", bookingPayload, flights)

	res.status(200).json({
		flights: flights, 
		message: "Avail Flight Options"
	})
}