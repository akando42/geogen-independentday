import React from "react"
import Head from "next/head";
import Image from "next/image"

import path from "path"

import { 
	getSortedCities,
	getPostData
} from "../../../../libs/posts"


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

	return {
		props: {
			postData: postData
		}
	}
}

export async function getStaticPaths({}) {
	let fertileSteps = getSortedCities(
		'./public/content/geogen/Expansion'
	)

	let cities = fertileSteps.cities
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
			postImage: ''
		}
	}

	async loadContent(){
		
	}	

	componentDidMount(){
		this.loadContent()
	}

	render(){
		let content = this.props.postData.contentHtml
		console.log(content)

		return (
			<div>
				<div 
					dangerouslySetInnerHTML={{__html: content }} 
				/>
			</div>
		)
	}
}