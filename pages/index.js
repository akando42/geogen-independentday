import Head from 'next/head'
import Image from 'next/image'
import { Component } from "react"

import path from "path" 
import { getSortedDates,getSortedCities} from '../libs/posts'
import styles from '../styles/Home.module.css'

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl';
import React from 'react'

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlsbG9kZXNpZ24iLCJhIjoiY2w1aXhxcm5pMGIxMTNsa21ldjRkanV4ZyJ9.ztk5_j48dkFtce1sTx0uWw';

export async function getStaticProps(){
	let dates = getSortedDates('./public/content/locations')

	const fertileSteps = './public/content/geogen/Expansion'
	let fertileCities = getSortedCities(fertileSteps)

	const selfharmSteps = './public/content/geogen/Compression'
	let selfharmCities = getSortedCities(selfharmSteps)

	// console.log("Sorted Dates ", dates)
	
	return {
		props: {
			dates: dates,
			fertileSteps: fertileCities.steps,
			fertileCities: fertileCities.cities,
			selfharmSteps: selfharmCities.steps,
			selfharmCities: selfharmCities.cities
		}
	}
}

export default class Main extends Component {
	constructor(props){
		super(props)

		this.state = {
			lat: 21,
      		lng: 150,
      		zoom: 2,
      		cities: [], 
      		uniqueCities: [],
      		sign: "Expansion",
      		headLine: "GeoGenetics",
      		showingDates: true,
      		showingCity: false, 
      		sortedRange: [],
      		activeCity: {
      			city: "wtf",
      			tactics: [
      				{}
      			]
      		}
		}

		this.loadMap = this.loadMap.bind(this)
		this.getData = this.getData.bind(this)
		this.selectTactic = this.selectTactic.bind(this)

		this.mapMode = this.mapMode.bind(this)
		this.flyTo = this.flyTo.bind(this)

		this.loadFertileCities = this.loadFertileCities.bind(this)
		this.loadSelfharmCities = this.loadSelfharmCities.bind(this)

		this.loadUniqueCities = this.loadUniqueCities.bind(this)

		this.showCity = this.showCity.bind(this)
		this.showDate = this.showDate.bind(this)

		this.showDateRange = this.showDateRange.bind(this)

		this.mapContainer = React.createRef();
	}	

	async loadCity(city){
	  let the_city = 
	  	city === "Saigon" ? "Ho Chi Minh" :
	  	city === "Dayton" ? "Cleveland" :
	  	city === "Santa Fe" ? "Santa Fe US" :
	  	city === "Bavaria" ? "Bavaria Germany" :
	  	city === "Delhi" ? "Delhi India" :
	  	city === "Vinh" ? "Vinh Vietnam" :
	  	city === "Athen" ? "Athen Greece" :
	  	city === "Bikini Atoll" ? "Marshall Islands" :
  		city;
	  

	  const res = await fetch(
	    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(the_city)}.json?types=place&limit=1&access_token=${mapboxgl.accessToken}`
	  );

	  const data = await res.json();
	  // console.log(city)
	  // console.log(data)
	  // console.log(res)

	  if (data.features[0]){
	  	// console.log(data.features[0].center)
	  	let cityCoordinate = data.features[0].center	
	  	return cityCoordinate; // [lng, lat]
	  } else {
	  	if (city == "Jarkata"){
	  		let cityCoordinate = [107.01733715281085, -6.204944715958651]
	  		// console.log(cityCoordinate)
	  		return cityCoordinate
	  	}
	  	let cityCoordinate = [105, 21]
	  	return cityCoordinate
	  }
	}

	async getData(chosenCities){
		// console.log("Getting Data")
		// let cities = []

		// this.props.dates.map(async(date) => {
		// 	// console.log(date)
		// 	let coordinate = await this.loadCity(date.city)
		// 	let cityObject = {
		// 		city: date.city,
		// 		lat: coordinate[1],
		// 		lng: coordinate[0],
		// 		independent_date: date.independent_date,
		// 		full_path: date.full_path 
		// 	}
		// 	cities.push(cityObject)
		// 	// this.loadCities()
		// })

		// this.setState({
		// 	cities: cities
		// })

		// return cities
		
		// let chosenArray = Math.random() < 0.5 ? this.props.fertileCities : this.props.selfharmCities
		let chosenArray = chosenCities

		const cities = await Promise.all(
		    chosenArray.map(async (date) => {
		      
		      const coordinate = await this.loadCity(date.city);
		      if (!coordinate) return null;
		      // console.log("City Coordinate ", coordinate)

		      let full_path = date.full_path ? date.full_path : date.path

		      let tactic_path = full_path.split("/")[3]
		      let tactic_index = parseInt(tactic_path.split("_")[0])-1
		      full_path = full_path + "#" + tactic_index
		      // console.log("Date ", tactic_path, tactic_index)

		      return {
		        city: date.city,
		        lat: coordinate[1],
		        lng: coordinate[0],
		        // tactic: date.tactic,
		        independent_date: date.independent_date,
		        full_path: full_path
		      };
		    })
		  );

		// const filteredCities = cities.filter(Boolean);

		this.setState({ cities: cities });

		return cities;
	}

	async getGeoGenData(chosenCities){
		let chosenArray = chosenCities

		const cities = await Promise.all(
		    chosenArray.map(async (city) => {

		      const coordinate = await this.loadCity(city.city);
		      if (!coordinate) return null;
		      // console.log("City Coordinate ", coordinate)
		      // let full_path = date.full_path ? date.full_path : date.path
		      // let tactic_path = full_path.split("/")[3]
		      // let tactic_index = parseInt(tactic_path.split("_")[0])-1
		      // full_path = full_path + "#" + tactic_index
		      // console.log("Date ", tactic_path, tactic_index)
		      console.log("CITY ",city)

		      return {
		        city: city.city,
		        lat: coordinate[1],
		        lng: coordinate[0], 
		        tactics: city.tactics,
		        full_path: "/"
		        
		        // // tactic: date.tactic,
		        // independent_date: date.independent_date,
		        // full_path: full_path
		      };
		    })
		  );

		// const filteredCities = cities.filter(Boolean);

		this.setState({ uniqueCities: cities });

		return cities;
	}

	async showCity(city){
		let cityData = this.state.uniqueCities
			.filter(uniqueCity => uniqueCity.city === city)

		console.log(cityData)

		this.setState({
			showingCity: !this.state.showingCity, 
			activeCity: cityData[0]
		})

		console.log(
			city, 
			cityData, 
			this.state.activeCity
		)
	}

	async loadMap(chosenCities, stepSelection){
		const { lng, lat, zoom } = this.state;
		const  mobileOrNot = window.matchMedia("(max-width: 800px)");
		const optimalZoom = mobileOrNot.matches && this.state.cities.length > 1 ? 1.2 : zoom ;

		const map = new mapboxgl.Map({
	        container: this.mapContainer.current,
	        style: 'mapbox://styles/hillodesign/clb95v8zd000v15nudmodao0i',
	        center: [lng, lat],
	        projection: 'mercator',
	        zoom: optimalZoom
	    });
		// console.log("Load Map for ", chosenCities)

	    let cities = await this.getData(chosenCities)
	    // console.log("Cities adding to Map", cities)

		if (cities.length > 0){
			cities.map(city => {
				let sign = city.full_path.split("/")[2]
				// console.log("Add to Map", city, sign)

				const lng = city.lng 
		    	const lat = city.lat 

		    	const popup = new mapboxgl
		    		.Popup({ 
		    			anchor: 'top', 
		    			offset: 0, 
		    			closeOnClick: true
		    		})
		    		.setMaxWidth('360px')
		    		.setHTML(`
		    			<a class="city-card" href=${city.full_path}>
		    				<h3> ${city.city} </h3>
		    			</a>
		    		`)
		    	const el = document.createElement('div')

				el.className = (sign === "Expansion") ? 'red-dot-marker' : 'black-dot-marker'
				el.innerHTML = '<span class="ping"></span>'

				el.addEventListener('click', (e) => {
					// e.stopPropagation() 
					// optional: prevent map click events
					this.showCity(city.city)
					console.log('Marker clicked', { lng, lat })
				})

		    	const marker = new mapboxgl
		    	    // .Marker({
		    	    // 	color: `red`,
		    	    // 	occludedOpacity: 0.1
		    	    // })
		    		.Marker({
					  element: el,
					  anchor: 'center'
					})
		    	    .setLngLat([lng,lat])
		    	    // .setPopup(popup)
		    	    .addTo(map)

		    	if (stepSelection){
		    		marker.togglePopup();	
		    	}
		    	
			})
		}

		this.setState({
			map: map
		})
	}

	async loadGeoGenMap(chosenCities){
		const { lng, lat, zoom } = this.state;
		const  mobileOrNot = window.matchMedia("(max-width: 800px)");

		const optimalZoom = mobileOrNot.matches && this.state.uniqueCities.length > 1 ? 1.2 : zoom ;

		const map = new mapboxgl.Map({
	        container: this.mapContainer.current,
	        style: 'mapbox://styles/hillodesign/clb95v8zd000v15nudmodao0i',
	        center: [lng, lat],
	        projection: 'mercator',
	        zoom: optimalZoom
	    });

	    let cities = await this.getGeoGenData(chosenCities)

	    console.log("Cities ", cities)

	    if (cities.length > 0){
			cities.map(city => {
				// let sign = city.full_path.split("/")[2]
				let sign = "Expansion"

				// console.log("Add to Map", city, sign)

				const lng = city.lng 
		    	const lat = city.lat 

		    	const tactics = city.tactics
		    	console.log("Tactics ", tactics)

		    	const html = tactics
					.map(tactic => `
						<a 
							href=${tactic.path}
							class="${tactic.sign === 'Expansion' ? 'expansion' : 'compression'}"
						>
							<h3>${tactic.tactic}</h3>
						</a>
						`)
					.join("")

		    	const popup = new mapboxgl
		    		.Popup({ 
		    			anchor: 'left', 
		    			offset: 0, 
		    			closeOnClick: true
		    		})
		    		.setMaxWidth('360px')
		    		.setHTML(html)

		    	const el = document.createElement('div')
				el.className = (sign === "Expansion") ? 'red-dot-marker' : 'black-dot-marker'
				el.innerHTML = '<span class="ping"></span>'

		    	const marker = new mapboxgl
		    	    // .Marker({
		    	    // 	color: `red`,
		    	    // 	occludedOpacity: 0.1
		    	    // })
		    		.Marker({
					  element: el,
					  anchor: 'center'
					})
		    	    .setLngLat([lng,lat])
		    	    .setPopup(popup)
		    	    .addTo(map)
			})
		}

		this.setState({
			map: map
		})
	}

	async selectTactic(event){
		let tactic = event.target.dataset.tactic.slice(3)
		let sign = event.target.dataset.sign

		this.setState({
			headLine: tactic.replace(/_/g, ' ')
		})

		if (sign === "Expansion"){
			let cities = this.props.fertileCities.filter(city => city.tactic === tactic)
			// console.log("Select tactic ", tactic)
			// console.log("Cities ", cities)
			this.loadMap(cities, true)
			
		} else {
			let cities = this.props.selfharmCities.filter(city => city.tactic === tactic)
			// console.log("Select tactic ", tactic)
			// console.log("Cities ", cities)
			this.loadMap(cities, true)
		}
	}

	async selectCity(event){
	}

	async flyTo(event){
		// this.mapMode()
		
		const lng = event.target.dataset.lng
   		const lat = event.target.dataset.lat
		
		console.log(
			"Triggered", lng, lat, this.state.zoom
		)
		const map = this.state.map

        map.flyTo({
        	center: [lng, lat],
        	zoom: 6,
        })
	}

	async mapMode(){
		// console.log("Steps",this.props.fertileSteps)
  		// console.log("Fertile Cities ", this.props.fertileCities)
  		// console.log("Selfharm Cities", this.props.selfharmCities)

  		let allCities = [...this.props.fertileCities, ...this.props.selfharmCities]
  		console.log("Cities ", allCities)

  		// CHATGPT SOLUTION
  		// const cities = Object.values(
		//   allCities.reduce((cityAcc, item) => {
		//     const { city, tactic, path } = item

		//     // derive sign from URL
		//     const sign = path.split("/")[2] // Expansion | Compression

		//     // 1. City level
		//     if (!cityAcc[city]) {
		//       cityAcc[city] = {
		//         city,
		//         tactics: {}
		//       }
		//     }

		//     // 2. Tactic level
		//     if (!cityAcc[city].tactics[tactic]) {
		//       cityAcc[city].tactics[tactic] = {
		//         name: tactic,
		//         entries: []
		//       }
		//     }

		//     // 3. Entry level (avoid duplicate signs)
		//     const exists = cityAcc[city].tactics[tactic].entries.some(
		//       e => e.sign === sign
		//     )

		//     if (!exists) {
		//       cityAcc[city].tactics[tactic].entries.push({
		//         sign,
		//         path
		//       })
		//     }

		//     return cityAcc
		//   }, {})
		// ).map(city => ({
		//   ...city,
		//   tactics: Object.values(city.tactics)
		// }))
		// console.log("CITIES ", cities)


  		// HUMAN SOLUTION
  		let uniqueCities = []
  		allCities.map(city => {
  			const exist = uniqueCities.some(
  				item => item.city === city.city
  			) 

  			if (exist){
  				// console.log(exist, city)
  				uniqueCities = uniqueCities.map(item => 
  					item.city === city.city
  					? 	{
  							city: item.city, 
  							tactics: [
  								...item.tactics, 
  								{
  									tactic: city.tactic,
  									path: city.path,
  									sign: city.path.split("/")[2]
  								}
  							] 
  						}
  					: 	item
  				)
  			} else {
  				// console.log(exist, city)
  				uniqueCities.push({
  					city: city.city, 
  					tactics: [{
  						tactic: city.tactic,
  						path: city.path,
  						sign: city.path.split("/")[2]
  					}]
  				})
  			}
  		})

  		console.log("UNIQUE CITIES", uniqueCities)
  		this.setState({
  			uniqueCities: uniqueCities
  		})

  		this.loadGeoGenMap(uniqueCities)
	}

	async loadFertileCities(){
		this.loadMap(this.props.fertileCities)
		this.setState({
			sign: "Expansion"
		})
	}

	async loadSelfharmCities(){
		this.loadMap(this.props.selfharmCities)
		this.setState({
			sign: "Compression"
		})
	}

	async loadUniqueCities(){
		let allCities = [...this.props.fertileCities, ...this.props.selfharmCities]
  		console.log("Cities ", allCities)

  		// HUMAN SOLUTION
  		let uniqueCities = []
  		allCities.map(city => {
  			const exist = uniqueCities.some(
  				item => item.city === city.city
  			) 

  			if (exist){
  				// console.log(exist, city)
  				uniqueCities = uniqueCities.map(item => 
  					item.city === city.city
  					? 	{
  							city: item.city, 
  							tactics: [
  								...item.tactics, 
  								{
  									tactic: city.tactic,
  									path: city.path,
  									sign: city.path.split("/")[2]
  								}
  							] 
  						}
  					: 	item
  				)
  			} else {
  				// console.log(exist, city)
  				uniqueCities.push({
  					city: city.city, 
  					tactics: [{
  						tactic: city.tactic,
  						path: city.path,
  						sign: city.path.split("/")[2]
  					}]
  				})
  			}
  		})

  		console.log("UNIQUE CITIES", uniqueCities)
  		this.setState({
  			uniqueCities: uniqueCities
  		})
	}

	async showDate(){
		const today = new Date()
		console.log(today.toDateString())

		const this_year = today.getFullYear()
		let dates = this.props.dates

		let datesRange = dates.map(date => {
			let next_date = date.independent_date + "-" + this_year

			const [month, day, year] = next_date.split('-').map(Number)
			const targetDate = new Date(year, month - 1, day)

			today.setHours(0, 0, 0, 0)
			targetDate.setHours(0, 0, 0, 0)
			const diffMs = targetDate - today
			const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

			return {
				date: date.independent_date,
				next_date: next_date,
				city: date.city,
				range: diffDays
			}
		})

		let sortedRange = datesRange
			.filter(date => date.range > 0)
			.sort((a, b) => a.range - b.range)

		console.log(sortedRange[0])

		this.setState({
			today: today.toDateString(),
			sortedRange: sortedRange,
			showingDates: false,
			nextNation: sortedRange[0].city,
			nextDate: sortedRange[0].date
		})
	}

	async showDateRange(){
		this.setState({
			showingDates: !this.state.showingDates
		})
	}

	componentDidMount(){
		// Display all Cities and showing each Cities steps
		// this.mapMode()

		// Showing Expansion and Compression Steps
		this.loadMap(this.props.fertileCities)
		this.loadUniqueCities()
		this.showDate()

		// this.intervalId = setInterval(() => {
		// 	const city = this.state.cities[
		// 		Math.floor(Math.random() * this.state.cities.length)
		// 	]

		// 	console.log("Select City ", city)

		// 	this.state.map.flyTo({
		// 	  center: [city.lng, city.lat],
		// 	  zoom: 9,
		// 	  speed: 1.2,      // animation speed
		// 	  curve: 1.42,     // flight curvature
		// 	  essential: true  // respects reduced-motion settings
		// 	})
		// }, 10000)
	}

	componentWillUnmount() {
  		clearInterval(this.intervalId)
	}
  
  	render(){
  	
  		

  		return (
  			<div>

  				<a 
  					className={styles.text}
  					href="/geogen"
  				> 
  					GeoGen
  				</a>

	  			<div
	  				className={styles.map} 
					ref={this.mapContainer}
	  			>
	  			</div>

	  			<div className={styles.timePanel}>
	  				<div className={styles.clock}>
	  					{this.state.today} 
	  				</div>

	  				<div className={styles.independentDate}>
	  					<div 
	  						className={styles.inButton}
	  						onClick={this.showDateRange}
	  					>
	  						Upcoming Independent Day
	  					</div>
	  				</div>

	  				{
	  					this.state.showingDates 
	  					?	<div className={styles.dateRange}>
	  							{	
	  								this.state.sortedRange.map(date => {
	  									return (
	  										<div className={styles.nextDate}>
							  					<div>{date.city}</div>
							  					<div>{date.date}</div>
							  				</div>
	  									)
	  								})
	  							}
	  						</div>
	  					:   <div> Date Range </div>
	  				}
	  			</div>


	  			
	  			<div className={styles.stepSelection}>
	  				<div 
	  					className={`${styles.stepSelector} ${styles.expansion}`}
	  					onClick={this.loadFertileCities}
	  				> 
	  					Expansion 
	  				</div>
	  				<div 
	  					className={`${styles.stepSelector} ${styles.compression}`}
	  					onClick={this.loadSelfharmCities}
	  				>  
	  					Compression 
	  				</div>
	  			</div>

	  			<div className={styles.headLine}>
	  				{this.state.headLine}
	  			</div>

	  			{/* 
	  			<div className={styles.citySlides}>
	  				<div className={styles.track}>
	  					{	
	  						this.state.uniqueCities.map(city => {
	  							return (
	  								<div 
	  									className={styles.city}
	  									KEY={city.city}
	  									onClick={this.flyTo}
	  									data-lng={city.lng}
	  									data-lat={city.lat}
	  								>
	  									{city.city}
	  								</div>
	  							)
	  						})
	  					}
	  				</div>
	  			</div>
	  			*/}

	  			{
	  				this.state.showingCity && this.state.activeCity
	  				? 	<div 
	  						className={styles.cityStories}
	  					>
	  						<img
	  							className={styles.cityImage} 
	  							src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweq1ExTtSWGeW94koXFpvmLYNHq-uejteVt1bJ7J34zY0ELRgLQ1KHKDx0ZrZdCofNtpa2a2-rJRZidZSMGU18BIAsxM2q9brQvwPsCkFqywuibByNC-WieCSO-u7UZYUw6E9lU=w408-h305-k-no" 
	  						/>
	  						<div className={styles.cityName}>
	  							{this.state.activeCity.city}
	  						</div>
	  						{
	  							this.state.activeCity.tactics.map(tactic => {

	  								let selectedTactic = tactic.tactic.replace(/_/g, ' ')
	  								let sign = tactic.path.split("/")[2]
	  								
	  								return (
	  									<a 
	  										className={
												sign === "Expansion"
											  	? styles.tacticLink
											  	: styles.negTacticLink
											}
	  										href={tactic.path}
	  									>
	  										{selectedTactic}
	  									</a>
	  								)
	  							})
	  						}
	  					</div>
	  				: 	null
	  			}

	  			<div className={styles.slides}>
	  				<div className={styles.track}>
	  				{
	  					this.state.sign === "Expansion"
	  					? 	this.props.fertileSteps.map(step => {
		  						let tactic = step.tactic.replace(/_/g, ' ').slice(3)
		  						// console.log("tactic ", tactic)

		  						return (
		  							<div 
		  								className={styles.step}
		  								onClick={this.selectTactic}
		  								data-tactic={step.tactic}
		  								data-sign="Expansion"
		  							>
		  								{tactic}
		  							</div>
		  						)
		  					})
			  			: 	null

	  				}

	  				{
	  					this.state.sign === "Compression"
	  					?	this.props.selfharmSteps.map(step => {
		  						let tactic = step.tactic.replace(/_/g, ' ').slice(3)
		  						// console.log("tactic ", tactic)
		  						return (
		  							<div 
		  								className={styles.selfharmStep}
		  								onClick={this.selectTactic}
		  								data-tactic={step.tactic}
		  								data-sign="Compression"
		  							>
		  								{tactic}
		  							</div>
		  						)
		  					})
	  					:   null
	  				}

	  				{
	  					this.state.sign === "Expansion"
	  					? 	this.props.fertileSteps.map(step => {
		  						let tactic = step.tactic.replace(/_/g, ' ').slice(3)
		  						// console.log("tactic ", tactic)

		  						return (
		  							<div 
		  								className={styles.step}
		  								onClick={this.selectTactic}
		  								data-tactic={step.tactic}
		  								data-sign="Expansion"
		  							>
		  								{tactic}
		  							</div>
		  						)
		  					})
			  			: 	null

	  				}

	  				{
	  					this.state.sign === "Compression"
	  					?	this.props.selfharmSteps.map(step => {
		  						let tactic = step.tactic.replace(/_/g, ' ').slice(3)
		  						// console.log("tactic ", tactic)
		  						return (
		  							<div 
		  								className={styles.selfharmStep}
		  								onClick={this.selectTactic}
		  								data-tactic={step.tactic}
		  								data-sign="Compression"
		  							>
		  								{tactic}
		  							</div>
		  						)
		  					})
	  					:   null
	  				}
	  				</div>
	  			</div>
	  			
  				{/**
	  			<div>GeoGenetics</div>
	  			<div>Independent Dates Fun </div>
	  			{	 
	  				this.props.dates.map(date => {
	  					return ( 
	  						<div className={styles.dateCard}> 
	  							<div>{date.independent_date}</div>
	  							<div>{date.city}</div>
	  						</div> 
	  					)
	  				})
	  			}
	  			 **/}
  			</div>
  		)
  	}
}