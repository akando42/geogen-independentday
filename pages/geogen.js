import { Component } from "react"
import { getSortedCities } from '../libs/posts'

import SideBar from "@/components/SideBar"

import styles from '../styles/GeoGen.module.css'

export async function getStaticProps(){
	const fertileSteps = './public/content/geogen/Expansion'
	let fertileCities = getSortedCities(fertileSteps)

	const selfharmSteps = './public/content/geogen/Compression'
	let selfharmCities = getSortedCities(selfharmSteps)

	// console.log("Fertile Cities ", fertileCities)
	// console.log("Selfharm Cities ", selfharmCities)

	return {
		props: {
			fertileCities: fertileCities.steps,
			selfharmCities: selfharmCities.steps,
			allCities: fertileCities.cities
		}
	}
}

export default class Text extends Component {
	constructor(props){
		super(props)

		this.state = {
			selectedCities: [],
			openTactics: [],
			openNegTactics: []
		}

		this.setCities = this.setCities.bind(this)
		this.getTactics = this.getTactics.bind(this)
		this.setTactic = this.setTactic.bind(this)

		this.setNegTactic = this.setNegTactic.bind(this)
	}

	async setCities(event){
		console.log(event.target.dataset.cites)
		// this.setState({
		// 	selectedCities: event.target.dataset.cites
		// })
	}

	async getTactics(){
		let openTactics = this.props.fertileCities.map((city, index) => {
			return false
		})

		let openNegTactics = this.props.selfharmCities.map((city, index) => {
			return false
		})

		this.setState({
			openTactics: openTactics,
			openNegTactics: openNegTactics
		})
	}

	async setTactic(event){
		console.log("Tactic ", event.target.dataset.index)

		let id = event.target.dataset.index
		let openTactics = this.state.openTactics

		if (openTactics[id] === false){
			openTactics = openTactics.map(openTactic => {return false})
			openTactics[id] = true
			this.setState({
				openTactics: openTactics
			})
		} else {
			openTactics = openTactics.map(openTactic => {return false})
			this.setState({
				openTactics: openTactics
			})
		}
	}

	async setNegTactic(event){
		console.log("Setting Neg Tactic ", event.target.dataset.index)

		let id = event.target.dataset.index
		let openTactics = this.state.openNegTactics

		if (openTactics[id] === false){
			openTactics = openTactics.map(openTactic => {return false})
			openTactics[id] = true
			this.setState({
				openNegTactics: openTactics
			})
		} else {
			openTactics = openTactics.map(openTactic => {return false})
			this.setState({
				openNegTactics: openTactics
			})
		}
	}

	componentDidMount(){
		this.getTactics()
	}

	render(){
		// console.log(
		// 	"All Cities",
		// 	this.props.allCities
		// )

		return (
			<div className={styles.container}>
				<div className={styles.leftPanel}>
					{
						this.props.fertileCities.map((city, index) => {

							let tactic = city.tactic.replace(/_/g, ' ').slice(3)
							let cities = city.cities 

							let status = this.state.openTactics[index]

							return (
								<div 
									className={styles.section}
									key={index}
								> 
									<div
										className={styles.tactic} 
										onClick={this.setTactic}
										data-index={index}
									>
										{tactic}
									</div>
									{
										status
										?	<div className={styles.cityList}>
												{
													cities.map(c => {
														let city = c.city.replace(/_/g, ' ')
														return (
															<a
												  				key={city}
												  				className={styles.citySelection}
												  				href={c.path}
													  		>
													  			{city}
													  		</a>
														)
													})
												}
											</div>
										:   <div></div>
									}
								</div>
							)
						})
					}

					<SideBar 
						sign="minus"
						cities={this.props.selfharmCities}
						selectedCity={this.props.selectedCity}
						setTactic={this.setNegTactic}
						openTactics={this.state.openNegTactics}
					/>
				</div>

				<div className={styles.rightPanel}>
					{
						this.state.selectedCities.map(
							city => {
								return (
									<div> {city} </div>
								)
							}
						)
					}
				</div>
			</div>
		)
	}
}