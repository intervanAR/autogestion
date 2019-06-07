const pagesStyle = theme => ({
	wrapper: {
		position: "relative",
		top: "70px",
		margin: "20px",
		height: "calc(100vh - 70px)",
		"&:after": {
			display: "table",
			clear: "both",
			content: '" "'
		}
	},
	card: {
		marginTop: "0px",
	},
  justificado: {
		position: "relative",
		textAlign: "justify",
		top: "0px",
		margin: "20px",
	},	
	centrado: {
		position: "relative",
		textAlign: "center",
		top: "0px",
		margin: "0px",
	},
});

export default pagesStyle;
