import React from "react"
import Head from "next/head";
import Image from "next/image"

import Layout from "@/components/Layout"
import SideBar from "@/components/SideBar"
import MainContent from "@/components/MainContent"

import path from "path"

import { 
	getSortedCities,
	getPostData
} from "@/libs/posts"


const postsDir = "public/content/geogen"
const postsDirectory = path.join(process.cwd(), postsDir)

export async function getStaticProps({ params }) {
	
	console.log("Params", params)
	let postDir = path.join(
		postsDirectory,
		params.step_sign, 
		params.tactic
	)

	console.log(postDir)
	const postData = await getPostData(postDir, params.id)
	
	let tacticIndex = parseInt(params.tactic.split("_")[0])-1
	console.log("PARAMS ", params.tactic, tacticIndex)

	const fertileSteps = './public/content/geogen/Expansion'
	let fertileCities = getSortedCities(fertileSteps)

	const selfharmSteps = './public/content/geogen/Compression'
	let selfharmCities = getSortedCities(selfharmSteps)

	return {
		props: {
			selectedCity: params.id,
			tacticIndex: tacticIndex,
			postData: postData,
			fertileCities: [...fertileCities.steps, ...selfharmCities.steps]
		}
	}
}

export async function getStaticPaths({}) {
	let fertileSteps = getSortedCities(
		'./public/content/geogen/Expansion'
	)

	let selfharmSteps = getSortedCities(
		'./public/content/geogen/Compression'
	)

	let cities = [...fertileSteps.cities, ...selfharmSteps.cities]
	// console.log("Cities",fertileSteps.cities)

	let paths = cities.map(city => {
		return city.path
	})

	return {
		paths: paths,
		fallback: false
	}
}

export default class Posts extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			post: "POST", 
			postImage: '',
			openTactics: [],
			openNegTactics: [],
			showingSidebar: true,
		}

		this.setTactic = this.setTactic.bind(this)
		this.toggleSidebar = this.toggleSidebar.bind(this)
	}

	async loadContent(){
		const isMobile = window.innerWidth <= 768;
		console.log("IS MOBILE ", isMobile)
		if (isMobile){
			this.setState({
				showingSidebar: false
			})
		} else {
			this.setState({
				showingSidebar: true
			})
		}
	}	

	async getTactics(){
		let openTactics = this.props.fertileCities.map((city, index) => {
			return false
		})

		openTactics[this.props.tacticIndex] = true

		// let openNegTactics = this.props.selfharmCities.map((city, index) => {
		// 	return false
		// })

		this.setState({
			openTactics: openTactics
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

	async toggleSidebar(){
		this.setState({
			showingSidebar: !this.state.showingSidebar
		})
	}

	componentDidMount(){
		this.getTactics()
		this.loadContent()
	}

	render(){
		let content = this.props.postData.contentHtml
		console.log(content)

		return (
			<Layout
				sideBarStatus={this.state.showingSidebar}
			>
				{
					this.state.showingSidebar 
					?	<SideBar 
							cities={this.props.fertileCities}
							selectedCity={this.props.selectedCity}
							setTactic={this.setTactic}
							openTactics={this.state.openTactics}
						/>
					:   <div></div>
				}
				
				<MainContent
					content={content}
					toggleSidebar={this.toggleSidebar}
				/>
			</Layout>
		)
	}
}