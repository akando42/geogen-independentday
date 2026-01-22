import Head from 'next/head'
import Image from 'next/image'
import { Component } from "react"

import path from "path" 
import { getSortedDates } from '../libs/posts'

export async function getStaticProps(){
	const independentdates = path.join(
		process.cwd(), 'public/content/locations'
	)

	let dates = getSortedDates(independentdates)

	console.log("Sorted Dates ", dates)
	
	return {
		props: {
			dates: dates
		}
	}
}

export default class Main extends Component {
	constructor(props){
		super(props)
	}	

	componentDidMount(){

	}
  
  	render(){
  		console.log(this.props.dates)
  		return (
  			<div>
	  			<div>GeoGenetics</div>
	  			<div>Independent Dates Fun </div>
	  			{	 
	  				this.props.dates.map(date => {
	  					return ( 
	  						<div> {date} </div> 
	  					)
	  				})
	  			}
  			</div>
  		)
  	}
}