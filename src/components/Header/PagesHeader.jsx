import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";

// core components
import Button from "components/CustomButtons/Button";

import pagesHeaderStyle from "../../assets/jss/components/pagesHeaderStyle.jsx";

class PagesHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleDrawerToggle = () => {
		this.setState({open: !this.state.open});
	};

	componentDidUpdate(e) {
		if (e.history.location.pathname !== e.location.pathname) {
			this.setState({open: false});
		}
	}

	render() {
		const {classes, color} = this.props;
		const appBarClasses = cx({
			[" " + classes[color]]: color
		});
		return (
			<AppBar position="static" className={classes.appBar + appBarClasses}>
				<Toolbar className={classes.container}>
					<Hidden smDown>
						<div className={classes.flex}>
							<div className={classes.title} color="transparent">AUTOGESTION</div>
						</div>
					</Hidden>
					<Hidden mdUp>
						<div className={classes.flex}>
							<div className={classes.title} color="transparent">AUTOGESTION</div>
						</div>
					</Hidden>
					<Hidden mdUp>
						<Hidden mdUp>
							<Drawer
								variant="temporary"
								anchor={"left"}
								open={this.state.open}
								classes={{
									paper: classes.drawerPaper
								}}
								onClose={this.handleDrawerToggle}
								ModalProps={{
									keepMounted: true // Better open performance on mobile.
								}}
							>
							</Drawer>
						</Hidden>
					</Hidden>
				</Toolbar>
			</AppBar>
		);
	}
}

PagesHeader.propTypes = {
	classes: PropTypes.object.isRequired,
	color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

export default withStyles(pagesHeaderStyle)(PagesHeader);
