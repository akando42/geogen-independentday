import styles from "./sidebar.module.css";

export default function SideBar(props) {
	let cities = props.cities
	let setTactic = props.setTactic
	
	console.log(
		"Tactic Status" ,
		props.openTactics
	)

	return (
		<div>
			{
				cities.map((city, index) => {

					let tactic = city.tactic.replace(/_/g, ' ').slice(3)
					let cities = city.cities 

					let status = props.openTactics[index]

					console.log(status)

					return (
						<div 
							className={styles.section}
							key={index}
						> 
							<div
								className={styles.tactic} 
								onClick={setTactic}
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
		</div>
	)
}