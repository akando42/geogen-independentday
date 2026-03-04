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
			adminPassword: ''
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

	componentDidMount(){

	}

	render(){
		console.log("Fertile Cities ", this.props.fertileCities)
		console.log("Selfharm Cities ", this.props.selfharmCities)
		console.log("Cities ", this.props.uniqueCities)


		return (
			<div>
			{	
				this.state.authenticated
				?	<div className={styles.container}>
						<div>AIRPORT</div>
						<div className={styles.list}>
							{	
								this.props.uniqueCities.map(city => {
									return ( 
										<div className={styles.row}>
											<div className={styles.cityName}>
												{city}
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
												data-city={city}
												onClick={this.updateCity}
											> 
												Get Airport CODE 
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