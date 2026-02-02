import { Component } from "react"
import styles from "./layout.module.css";

export default class Layout extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount(){

	}

	render(){
		let [left, right] = this.props.children

		return (
			<div className={styles.container}>
				<div className={styles.leftPanel}>
					{left}
				</div>

				<div className={styles.rightPanel}>
					{right}
				</div>

				<a 
  					className={styles.map}
  					href="/"
  				> 
  					GeoGen
  				</a>
			</div>
		)
	}
}