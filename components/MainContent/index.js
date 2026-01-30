import styles from "./maincontent.module.css";

export default function MainContent(props) {
	return (
		<div className={styles.container}>
			<div 
				dangerouslySetInnerHTML={{__html: props.content }} 
			/>
		</div>
	)
}