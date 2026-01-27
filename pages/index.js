import Head from 'next/head'
import Image from 'next/image'
import { Component } from "react"

import path from "path" 
import { getSortedDates } from '../libs/posts'
import styles from '../styles/Home.module.css'

import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl';
import React from 'react'

mapboxgl.accessToken = 'pk.eyJ1IjoiaGlsbG9kZXNpZ24iLCJhIjoiY2w1aXhxcm5pMGIxMTNsa21ldjRkanV4ZyJ9.ztk5_j48dkFtce1sTx0uWw';

export async function getStaticProps(){
	const independentdates = path.join(
		process.cwd(), 'public/content/locations'
	)

	let dates = getSortedDates(independentdates)

	// console.log("Sorted Dates ", dates)
	
	return {
		props: {
			dates: dates
		}
	}
}

export default class Main extends Component {
	constructor(props){
		super(props)

		this.state = {
			lat: 21,
      		lng: 105,
      		zoom: 2,
      		cities: []
		}

		this.loadMap = this.loadMap.bind(this)
		this.getData = this.getData.bind(this)

		this.mapContainer = React.createRef();
	}	

	async loadCity(city){
	  let the_city = city === "Saigon" ? "Ho Chi Minh" : city;

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
	  	let cityCoordinate = [21, 105]
	  	return cityCoordinate
	  }
	}

	async getData(){
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

		const cities = await Promise.all(
		    this.props.dates.map(async (date) => {
		      const coordinate = await this.loadCity(date.city);

		      if (!coordinate) return null;

		      return {
		        city: date.city,
		        lat: coordinate[1],
		        lng: coordinate[0],
		        independent_date: date.independent_date,
		        full_path: date.full_path
		      };
		    })
		  );

		const filteredCities = cities.filter(Boolean);

		this.setState({ cities: filteredCities });

		return filteredCities;
	}

	async loadMap(){
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

	    let cities = await this.getData()
	    console.log(cities)

		if (cities.length > 1){
			cities.map(city => {
				console.log("Add to Map", city)

				const lng = city.lng 
		    	const lat = city.lat 

		    	const popup = new mapboxgl
		    		.Popup({ 
		    			anchor: 'bottom-left', 
		    			offset: 25, 
		    			closeOnClick: true
		    		})
		    		.setMaxWidth('360px')
		    		.setHTML(`
		    			<a href="/">
		    				<h3> ${city.city} </h3>
		    			</a>
		    		`)
		    	const marker = new mapboxgl
		    	    .Marker({
		    	    	color: `black`,
		    	    	occludedOpacity: 0.1
		    	    })
		    	    .setLngLat([lng,lat])
		    	    .setPopup(popup)
		    	    .addTo(map)
			})
		}
	}

	componentDidMount(){
		this.loadMap()
	}
  
  	render(){
  		// console.log("Dates",this.props.dates)

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