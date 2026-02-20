import styles from "./maincontent.module.css";

export default function MainContent(props) {
	return (
		<div className={styles.container} onClick={props.toggleSidebar}>
			<div 
				dangerouslySetInnerHTML={{__html: props.content }} 
			/>
		</div>
	)
}