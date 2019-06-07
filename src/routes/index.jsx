import MainLayout from "../layouts/MainLayout";
import {getFullUrl} from '../core/globals';

const indexRoutes = [
	{ path: getFullUrl(), component: MainLayout }
	];

export default indexRoutes;
