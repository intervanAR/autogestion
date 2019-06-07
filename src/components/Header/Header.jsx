import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";

// material-ui icons
import Menu from "@material-ui/icons/Menu";
import MoreVert from "@material-ui/icons/MoreVert";
import ViewList from "@material-ui/icons/ViewList";

// core components
import Button from "../../components/CustomButtons/Button.jsx";

import headerStyle from "../../assets/jss/components/headerStyle.jsx";

@withStyles(headerStyle)
export default class Header extends React.Component {

	static defaultProps = {
		showTitle: true
	};

	static propTypes = {
		classes: PropTypes.object.isRequired,
		color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
		rtlActive: PropTypes.bool,
		sidebarMinimize: PropTypes.func.isRequired,
		miniActive: PropTypes.bool.isRequired,
		showTitle: PropTypes.bool,
		routes: PropTypes.array.isRequired,
		handleDrawerToggle: PropTypes.func.isRequired,
		children: PropTypes.any
	};

	makeBrand() {
		const {routes, location} = this.props;
		let name = '';
		routes.map((prop) => {
			if (prop.collapse) {
				prop.views.map((view) => {
					if (view.path === location.pathname) {
						name = view.name;
					}
					return null;
				});
			}
			if (prop.path === location.pathname) {
				name = prop.name;
			}
			return null;
		});
		return name;
	}

	render() {
		const {classes, color, rtlActive, miniActive, sidebarMinimize, handleDrawerToggle, children, showTitle} = this.props;
		const appBarClasses = cx({
			[" " + classes[color]]: color
		});
		const sidebarMinimizeStyle =
			classes.sidebarMinimize +
			" " +
			cx({
				[classes.sidebarMinimizeRTL]: rtlActive
			});
		return (
			<AppBar className={classes.appBar + appBarClasses}>
				<Toolbar className={classes.container}>
					<Hidden smDown implementation="css">
						<div className={sidebarMinimizeStyle}>
							{miniActive ? (
								<Button
									justIcon
									round
									color="white"
									onClick={sidebarMinimize}
								>
									<ViewList className={classes.sidebarMiniIcon}/>
								</Button>
							) : (
								<Button
									justIcon
									round
									color="white"
									onClick={sidebarMinimize}
								>
									<MoreVert className={classes.sidebarMiniIcon}/>
								</Button>
							)}
						</div>
					</Hidden>
					<div className={classes.brandContainer}>
						{/* Here we create navbar brand, based on route name */}
						{showTitle && <Button href="#" className={classes.title} color="transparent">
							{this.makeBrand()}
						</Button>}
						{children}
					</div>
					<Hidden smDown implementation="css">

					</Hidden>
					<Hidden mdUp implementation="css">
						<Button
							className={classes.appResponsive}
							color="transparent"
							justIcon
							aria-label="open drawer"
							onClick={handleDrawerToggle}
						>
							<Menu/>
						</Button>
					</Hidden>
				</Toolbar>
			</AppBar>
		);
	}
}
