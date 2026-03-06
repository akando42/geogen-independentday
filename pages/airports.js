import Head from 'next/head'
import { Component } from "react" 

import React from 'react'
import axios from 'axios'

import path from 'path'
import { getSortedCities } from '../libs/posts'

import { auth } from "@/libs/firebase"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"

import styles from '../styles/Airport.module.css'

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
			cities: []
		}

		this.setEmail = this.setEmail.bind(this)
		this.setPassword = this.setPassword.bind(this)
		this.authenticateAdmin = this.authenticateAdmin.bind(this)

		this.getAirportId = this.getAirportId.bind(this)
		this.updateCity = this.updateCity.bind(this)
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

	componentDidMount(){
		this.getCities()
	}

	render(){
		console.log("Fertile Cities ", this.props.fertileCities)
		console.log("Selfharm Cities ", this.props.selfharmCities)
		console.log(this.props.uniqueCities.length, "Cities ", this.props.uniqueCities)

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