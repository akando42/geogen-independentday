import { Component } from "react"
import { getSortedCities } from '../libs/posts'

import styles from '../styles/GeoGen.module.css'

export async function getStaticProps(){
	const fertileSteps = './public/content/geogen/Expansion'
	let fertileCities = getSortedCities(fertileSteps)

	return {
		props: {
			fertileCities: fertileCities
		}
	}
}

export default class Text extends Component {
	constructor(props){
		super(props)

		this.state = {
			selectedCities: [],
			openTactics: []
		}

		this.setCities = this.setCities.bind(this)
		this.getTactics = this.getTactics.bind(this)
		this.setTactic = this.setTactic.bind(this)
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

		this.setState({
			openTactics: openTactics
		})
	}

	async setTactic(event){
		console.log("Tactic ", event.target.dataset.index)

		let id = event.target.dataset.index
		let openTactics = this.state.openTactics
		openTactics[id] = !openTactics[id]

		this.setState({
			openTactics: openTactics
		})
	}

	componentDidMount(){
		this.getTactics()
	}

	render(){
		console.log(this.props.fertileCities)

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
													cities.map(c => (
												  		<div 
												  			key={c.city}
												  			className={styles.citySelection}
												  		>
												  			{c.city}
												  		</div>
													))
												}
											</div>
										:   <div></div>
									}
									
								</div>
							)
						})
					}
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