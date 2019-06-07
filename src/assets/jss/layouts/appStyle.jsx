// ##############################
// // // App styles
// #############################

import {
	drawerWidth,
	drawerMiniWidth,
	transition,
	containerFluid
} from "assets/jss/autogestion.jsx";

const appStyle = theme => ({
	wrapper: {
		position: "relative",
		top: "0",
		height: "100vh",
		"&:after": {
			display: "table",
			clear: "both",
			content: '" "'
		}
	},
	mainPanel: {
		transitionProperty: "top, bottom, width",
		transitionDuration: ".2s, .2s, .35s",
		transitionTimingFunction: "linear, linear, ease",
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth}px)`
		},
		overflow: "auto",
		position: "relative",
		float: "right",
		...transition,
		maxHeight: "100%",
		width: "100%",
		overflowScrolling: "touch",
		height: "100%"
	},
	content: {
		marginTop: "70px",
		minHeight: "calc(100vh - 200px)"
	},
	container: {
		...containerFluid,
		paddingRight: "0px",
		paddingLeft: "0px"
	},
	map: {
		marginTop: "70px"
	},
	mainPanelSidebarMini: {
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerMiniWidth}px)`
		}
	},
	mainPanelWithPerfectScrollbar: {
		overflow: "hidden !important"
	}
});

export default appStyle;
