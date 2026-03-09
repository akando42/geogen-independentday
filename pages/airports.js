import Head from 'next/head'
import { Component } from "react" 

import React from 'react'
import axios from 'axios'

import path from 'path'
import { getSortedCities } from '../libs/posts'

import { auth } from "@/libs/firebase"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl';

import styles from '../styles/Airport.module.css'

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlsbG9kZXNpZ24iLCJhIjoiY2w1aXhxcm5pMGIxMTNsa21ldjRkanV4ZyJ9.ztk5_j48dkFtce1sTx0uWw';

export async function getStaticProps(){
	const fertileSteps = './public/content/geogen/Expansion'
	let fertileCities = getSortedCities(fertileSteps)

	const selfharmSteps = './public/content/geogen/Compression'
	let selfharmCities = getSortedCities(selfharmSteps)

	let cities = [
		...fertileCities.cities.map(city => city.city), 
		...selfharmCities.cities.map(city => city.city) 
	]

	let uniqueCities = [...new Set(cities)]

	// console.log("Sorted Dates ", dates)
	
	return {
		props: {
			fertileSteps: fertileCities.steps,
			fertileCities: fertileCities.cities,
			selfharmSteps: selfharmCities.steps,
			selfharmCities: selfharmCities.cities,
			cities: cities,
			uniqueCities: uniqueCities
		}
	}
}

export default class Airport extends Component {
	constructor(props){
		super(props)

		this.state = {
			authenticated: false,
			adminEmail: '',
			adminPassword: '',
			cities: [],
			nations: [
			  {
			    "name": "United States",
			    "gdp_per_capital": 66683
			  },
			  {
			    "name": "Poland",
			    "gdp_per_capital": 17984
			  },
			  {
			    "name": "Russia",
			    "gdp_per_capital": 11043
			  },
			  {
			    "name": "Kazakhstan",
			    "gdp_per_capital": 11850
			  },
			  {
			    "name": "North Korea",
			    "gdp_per_capital": 1450
			  },
			  {
			    "name": "France",
			    "gdp_per_capital": 39441
			  },
			  {
			    "name": "Germany",
			    "gdp_per_capital": 44109
			  },
			  {
			    "name": "Switzerland",
			    "gdp_per_capital": 89783
			  },
			  {
			    "name": "India",
			    "gdp_per_capital": 2397
			  },
			  {
			    "name": "Marshall Islands",
			    "gdp_per_capital": 7800
			  },
			  {
			    "name": "United Kingdom",
			    "gdp_per_capital": 47265
			  },
			  {
			    "name": "China",
			    "gdp_per_capital": 13122
			  },
			  {
			    "name": "Vietnam",
			    "gdp_per_capital": 4018
			  },
			  {
			    "name": "Pakistan",
			    "gdp_per_capital": 1644
			  },
			  {
			    "name": "Singapore",
			    "gdp_per_capital": 67707
			  },
			  {
			    "name": "South Korea",
			    "gdp_per_capital": 36239
			  },
			  {
			    "name": "Taiwan",
			    "gdp_per_capital": 39477
			  },
			  {
			    "name": "Austria",
			    "gdp_per_capital": 45562
			  },
			  {
			    "name": "Brazil",
			    "gdp_per_capital": 9565
			  },
			  {
			    "name": "Thailand",
			    "gdp_per_capital": 	6573
			  },
			  {
			    "name": "Argentina",
			    "gdp_per_capital": 12667
			  },
			  {
			    "name": "Ukraine",
			    "gdp_per_capital": 2219
			  },
			  {
			    "name": "Iraq",
			    "gdp_per_capital": 4180
			  },
			  {
			    "name": "Qatar",
			    "gdp_per_capital": 62189
			  },
			  {
			    "name": "Hungary",
			    "gdp_per_capital": 16525
			  },
			  {
			    "name": "Australia",
			    "gdp_per_capital": 61212
			  },
			  {
			    "name": "Greece",
			    "gdp_per_capital": 21654
			  },
			  {
			    "name": "Portugal",
			    "gdp_per_capital": 22479
			  },
			  {
			    "name": "Canada",
			    "gdp_per_capital": 44402
			  },
			  {
			    "name": "Romania",
			    "gdp_per_capital": 12493
			  },
			  {
			    "name": "Netherlands",
			    "gdp_per_capital": 51471
			  },
			  {
			    "name": "Norway",
			    "gdp_per_capital": 79670
			  },
			  {
			    "name": "Italy",
			    "gdp_per_capital": 34398
			  },
			  {
			    "name": "Mexico",
			    "gdp_per_capital": 10313
			  },
			  {
			    "name": "Hong Kong",
			    "gdp_per_capital": 44725
			  },
			  {
			    "name": "Mongolia",
			    "gdp_per_capital": 4615
			  },
			  {
			    "name": "Bulgaria",
			    "gdp_per_capital": 10090
			  },
			  {
			    "name": "Egypt",
			    "gdp_per_capital": 4138
			  },
			  {
			    "name": "Indonesia",
			    "gdp_per_capital": 4368
			  },
			  {
			    "name": "Malaysia",
			    "gdp_per_capital": 11868
			  },
			  {
			    "name": "Cambodia",
			    "gdp_per_capital": 2184
			  },
			  {
			    "name": "Japan",
			    "gdp_per_capital": 37145
			  },
			  {
			    "name": "Philippines",
			    "gdp_per_capital": 3925
			  },
			  {
			    "name": "Israel",
			    "gdp_per_capital": 41845
			  },
			  {
			    "name": "Sweden",
			    "gdp_per_capital": 54916
			  },
			  {
			    "name": "Türkiye",
			    "gdp_per_capital": 15148
			  },
			  {
			    "name": "Venezuela",
			    "gdp_per_capital": 3000
			  }]
		}

		this.setEmail = this.setEmail.bind(this)
		this.setPassword = this.setPassword.bind(this)
		this.authenticateAdmin = this.authenticateAdmin.bind(this)

		this.getAirportId = this.getAirportId.bind(this)
		this.updateCity = this.updateCity.bind(this)

		this.getCityCoordinate = this.getCityCoordinate.bind(this)
		this.updateCityCoordinate = this.updateCityCoordinate.bind(this)

		this.getCityNation = this.getCityNation.bind(this)
		this.updateCityNation = this.updateCityNation.bind(this)
		this.updateCityIncome = this.updateCityIncome.bind(this)
	}

	async getAirportId(city) {
		const res = await axios.get(
			'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
			{
				params: {
					query: city
				},
				headers: {
					'X-RapidAPI-Key': '0723996e51mshf188c3b5271df8ep163c94jsna1d1ebb9bc9a',
					'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
				}
			}
		);

		// console.log("Booking.Com Airport API", res.data.data)

		// Find the main airport
		const airport = res.data.data.find(
			item => item.type === 'AIRPORT'
		);

		if (airport){
			console.log("Airport CODE ", airport.code)	
		}
		
		return {
			name: airport?.name,
			iata: airport?.code,          // e.g. "HAN"
			id: airport?.id               // e.g. "HAN.AIRPORT"
		};
	}

	async addAirport(event){
		await axios.post(
			"/api/addAirport", { city: event.target.dataset.city }
		).then(res => {
			console.log(res)
		})
	}

	async authenticateAdmin(e){
		e.preventDefault()
		console.log(
			this.state.userEmail,
			this.state.userPassword
		)

		const cred = await signInWithEmailAndPassword(
			auth, 
			this.state.adminEmail, 
			this.state.adminPassword
		)

      	document.cookie = `userId=${cred.user.uid}; path=/`

      	this.setState({
      		authenticated: true
      	})
	}

	async setEmail(e){
		this.setState({
			adminEmail: e.target.value
		})
	}

	async setPassword(e){
		this.setState({
			adminPassword: e.target.value
		})
	}

	async updateCity(e){
		console.log(
			"Updating city",
			e.target.dataset.city
		)

		let city = e.target.dataset.city
		let airportCodes = await this.getAirportId(city)

		console.log("Codes ", city, airportCodes.iata)

		await axios.post(
			"/api/updateAirport", 
			{ 	
				city: city,
				airportCode: airportCodes.iata ? airportCodes.iata : ""
			}
		).then(res => {
			console.log(res)
		})
	}

	async getCities(){
		await axios.get("/api/listAirports").then(res => {
			console.log("Cities ", res.data.cities)

			let nations = res.data.cities.map(city => city.nation)
			// let uniqueNations = [...new Set(nations)]

			// uniqueNations = uniqueNations.map(uniqueNation => {
			// 	return {
			// 		name: uniqueNation,
			// 		gdp_per_capital: 0
			// 	}
			// }) 

			this.setState({
				cities: res.data.cities
			})
		})
	}

	async getFlightInCost(event){
		const today = new Date().toDateString()

		const startDate = new Date(today);
		startDate.setMonth(startDate.getMonth() + 3)
		let bookingDate = startDate.toISOString().split('T')[0];

		console.log("Dataset ", event.target.dataset)

		let originAirport = `${event.target.dataset.originairport}.AIRPORT`
		let destinAirport = `${event.target.dataset.destinairport}.AIRPORT`

		console.log(
			"Booking Flight In For ", 
			bookingDate, 
			originAirport, 
			destinAirport
		)

		let payloadIn =  {
      		fromId: originAirport,
      		toId: destinAirport,
      		departDate: bookingDate,
      		cabinClass: "ECONOMY",
      		currency_code: "USD",
    	}

    	let inFlights = await axios.post(
    	"/api/searchFlights",
	    	payloadIn
	    ).then(res => {
	    	console.log("FLIGHT IN DATA ", bookingDate, res.data.flights)
	    	return res.data.flights
	    })  

	    let flightIn = parseInt(
  			inFlights.reduce((sum, flight) => sum + flight.priceRounded.units,0)/inFlights.length
  		)
  		// console.log(fromAirport, toAirport,"Flight In in USD ", flightIn)
	}

	async getFlightOutCost(){
		const today = new Date().toDateString()

		const startDate = new Date(today);
		startDate.setMonth(startDate.getMonth() + 3)
		let bookingDate = startDate.toISOString().split('T')[0];

		console.log("Dataset ", event.target.dataset)

		let originAirport = `${event.target.dataset.originairport}.AIRPORT`
		let destinAirport = `${event.target.dataset.destinairport}.AIRPORT`

		console.log(
			"Booking Flight In For ", 
			bookingDate, 
			originAirport, 
			destinAirport
		)

		let payloadOut =  {
	      fromId: originAirport,
	      toId: destinAirport,
	      departDate: bookingDate,
	      cabinClass: "ECONOMY",
	      currency_code: "USD",
	    }

	    let outFlights = await axios.post(
	    	"/api/searchFlights",
	    	payloadOut
	    ).then(res => {
	    	console.log("FLIGHT OUT DATA ", bookingDate, res.data.flights)
	    	return res.data.flights
	    })

	    let flightOut = parseInt(
  			outFlights.reduce((sum, flight) => sum + flight.priceRounded.units,0)/outFlights.length
  		)

  		console.log(originAirport, destinAirport,"Flight Out in USD ", flightOut)
	}

	async updateCityCoordinate(city, lat, lng){
		console.log("Updating city coordinate", city, lat, lng)

		// Update City Coordinate
		await axios.post(
			"/api/updateCityCoordinate", 
			{ 	
				city: city,
				lat: lat, 
				lng: lng
			}
		).then(res => {
			console.log(res.data.data)
			let cities = this.state.cities

			let updatedCities = cities.map(thecity => 
				thecity.city == city 
					?	{...thecity, lat: lat, lng: lng}
					:   thecity  
				)
			this.setState({
				cities: updatedCities
			})

		})
	}

	async getCityCoordinate(){
		let city = event.target.dataset.city

		let the_city = 
		  	city === "Saigon" ? "Ho Chi Minh" :
		  	city === "Dayton" ? "Cleveland" :
		  	city === "Santa Fe" ? "Santa Fe US" :
		  	city === "Bavaria" ? "Bavaria Germany" :
		  	city === "Delhi" ? "Delhi India" :
		  	city === "Vinh" ? "Vinh Vietnam" :
		  	city === "Athen" ? "Athen Greece" :
		  	// city === "Bikini Atoll" ? "Marshall Islands" :
	  		city;

	  	console.log("Getting Coordinate for ", the_city)
	  
		const res = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(the_city)}.json?types=place&limit=1&access_token=${mapboxgl.accessToken}`
		);

		const data = await res.json();
		// console.log(city)
		console.log(data)
		// console.log(res)

		if (data.features[0]){
			// console.log(data.features[0].center)
			let cityCoordinate = data.features[0].center

			console.log(
				the_city, 
				"lat ", cityCoordinate[1],
				"lng ", cityCoordinate[0]
			)

			await this.updateCityCoordinate(
				city, 
				cityCoordinate[1], 
				cityCoordinate[0] 
			)

			return cityCoordinate; // [lng, lat]
		} else {
			if (city == "Jarkata"){
				let cityCoordinate = [107.01733715281085, -6.204944715958651]
				console.log(the_city, "coordinate ", cityCoordinate)
				await this.updateCityCoordinate(
					the_city, 
					cityCoordinate[1], 
					cityCoordinate[0] 
				)
				return cityCoordinate
			}

			let cityCoordinate = [105, 21]
			await this.updateCityCoordinate(
				the_city, 
				cityCoordinate[1], 
				cityCoordinate[0] 
			)
			return cityCoordinate
		}

		location.reload()
	}

	async getCityNation(lat, lng) {
		const accessToken = 'pk.eyJ1IjoiaGlsbG9kZXNpZ24iLCJhIjoiY2w1aXhxcm5pMGIxMTNsa21ldjRkanV4ZyJ9.ztk5_j48dkFtce1sTx0uWw';;
		// const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

		const url =`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json` +`?types=place&limit=1&access_token=${accessToken}`;
		
		return await axios.get(url).then(res => {

			let data = res.data
			// console.log("Mapbox Data", data)	

			let place_name = data.features[0].text
			let place = data.features[0].place_name

			let nation = place.split(',').pop().trim();
			// console.log("Nation ", nation)

			// this.setState({
			// 	userPlace: place_name,
			// 	nation: nation
			// })

			return {
				city: place_name, 
				nation: nation
			}
		});
	}

	async updateCityNation(event){
		let city = event.target.dataset.city
		let lat = event.target.dataset.lat
		let lng = event.target.dataset.lng

		let data = await this.getCityNation(lat, lng)
		console.log("Updating City Nation ", data)

		// Update City Database with Nation value
		// Update City Coordinate
		await axios.post(
			"/api/updateCityNation", 
			{ 	
				city: city,
				nation: data.nation
			}
		).then(res => {
			console.log(res.data.data)
			let cities = this.state.cities

			let updatedCities = cities.map(thecity => 
				thecity.city == city
					?	{...thecity, nation: data.nation}
					:   thecity  
				)

			this.setState({
				cities: updatedCities
			})

		})
	}

	async updateCityIncome(event){
		console.log(
			"Updating Income for ", 
			event.target.dataset.city, 
			event.target.dataset.income
		)

		await axios.post(
			"/api/updateCityIncome",
			{
				city: event.target.dataset.city,
				monthy_income: event.target.dataset.income
			}
		).then(res => {
			console.log("RES", res.data.data)
			let data = res.data.data
			let updatedCities = this.state.cities.map(thecity => 
				thecity.city == data.city
					?	{...thecity, monthy_income: data.monthy_income}
					:   thecity  
				)

			this.setState({
				cities: updatedCities
			})
		})


	}

	componentDidMount(){
		this.getCities()
	}

	render(){
		// console.log("Fertile Cities ", this.props.fertileCities)
		// console.log("Fertile Steps ", this.props.fertileSteps)

		// console.log("Selfharm Cities ", this.props.selfharmCities)
		// console.log(this.props.uniqueCities.length, "Cities ", this.props.uniqueCities)

		// let databaseCities = this.state.cities.map(city => {return city.city})
		// console.log(databaseCities.length, "Database Cities ", databaseCities)
		
		// const diff = this.props.uniqueCities.filter(x => !databaseCities.includes(x))
		// console.log(diff)


		return (
			<div>
			{	
				this.state.authenticated
				?	<div className={styles.container}>
						<div> {this.state.cities.length} AIRPORT</div>
						<div className={styles.list}>
							{	
								this.state.cities.map(city => {
									let gdp_per_capital = this.state.nations.filter(nation => nation.name == city.nation)[0].gdp_per_capital
									gdp_per_capital = parseInt(gdp_per_capital/12)
									console.log(
										"Average Monthly Income ",
										gdp_per_capital
									)
									return ( 
										<div className={styles.row}>
											<div className={styles.cityName}>
												{city.city}
											</div>
											
											<div 
												className={styles.addButton}
												data-city={city}
												onClick={this.addAirport}
											> 
												Add to DB 
											</div>

											<div 
												className={styles.addButton}
												data-city={city.city}
												onClick={this.updateCity}
											> 
												Get Airport CODE 
											</div>

											<div
												className={styles.airportCode}
											>
												{city.airport}
											</div>
											<div 
												className={styles.addButton}
												onClick={this.getFlightInCost}
												data-originAirport={city.airport}
												data-destinAirport="HAN"
											> 
												Get Flight In Cost 
											</div>

											<div
												className={styles.airportCode}
											>
												$000
											</div>
											
											<div 
												className={styles.addButton}
												onClick={this.getFlightOutCost}
												data-originAirport="HAN"
												data-destinAirport={city.airport}
											> 
												Get Flight Out Cost 
											</div>

											<div
												className={styles.airportCode}
											>
												$000
											</div>

											{/*
											<div
												className={styles.addButton}
												onClick={this.getCityCoordinate}
												data-city={city.city}
											>
												Get City Coordinates
											</div>
											*/}

											<div
												className={styles.cityCoordinate}
											>
												{ city.lat ? city.lat : "lat" }
											</div>

											<div
												className={styles.cityCoordinate}
											>
												{ city.lng ? city.lng : "lng" }
											</div>

											{/*
											<div
												className={styles.addButton}
												onClick={this.updateCityNation}
												data-city={city.city}
												data-lat={city.lat}
												data-lng={city.lng}
											>
												Get Nation
											</div>
											*/}
											<div
												className={styles.cityCoordinate}
												
											>
												{ city.nation ? city.nation : "nation" }
											</div>
											{
												city.monthy_income 
												? 	<div className={styles.cityCoordinate}> 
														{city.monthy_income} 
													</div>
												: 	<div 
														className={styles.cityAverageIncome}
														onClick={this.updateCityIncome}
														data-city={city.city}
														data-income={gdp_per_capital}
													>
														{ gdp_per_capital }
													</div>
											}


										</div> 
									)
								})
							}
						</div>
					</div>
				:   <div className={styles.authentication}>
						<div>Authentication</div>
						<input 
							className={styles.email} 
							placeholder="Enter admin email"
							value={this.state.adminEmail}
							onChange={this.setEmail}
							type="email"
						/>
						<input 
							className={styles.email} 
							placeholder="Enter admin password"
							value={this.state.adminPassword}
							onChange={this.setPassword}
							type="password"
						/>

						<div
							className={styles.enterNow} 
							onClick={this.authenticateAdmin}
						> 
							Enter Now
						</div>
					</div>
			}
			</div>
			
		)
	}
}