import styles from "./sidebar.module.css";

export default function SideBar(props) {
	let cities = props.cities
	let setTactic = props.setTactic

	// console.log(
	// 	"Tactic Status" ,
	// 	props.openTactics
	// )


	return (
		<div className={styles.sideBarContainer}>
			{
				cities.map((city, index) => {

					let tactic = city.tactic.replace(/_/g, ' ').slice(3)
					let cities = city.cities 

					let status = props.openTactics[index]

					
					let sign = city.cities[0].path.split("/")[2]
					console.log("Negative city", city)
					console.log("Sign ", sign)

					return (
						<div 
							className={styles.section}
							key={index}
						> 
							<div
								className={`${
									sign === "Compression" ? styles.negativeTactic : styles.tactic
								}`} 
								onClick={setTactic}
								data-index={index}
								id={index}
							>
								{tactic}
							</div>
							{
								status
								?	<div 
										className={`${
											sign === "Compression" ? styles.negCityList : styles.cityList
										}`}
									>
										{
											cities.map(c => {
												let city = c.city.replace(/_/g, ' ')
												let selectedCity = props.selectedCity ? props.selectedCity.replace(/_/g, ' ') : ""

												let path = c.path + "#"+index

												return (
													<a
										  				key={city}
										  				className={`${
										  					selectedCity === city ? styles.selectedCity : styles.citySelection
										  				}`}
										  				href={path}
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