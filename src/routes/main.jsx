import HomeIcon from '@material-ui/icons/Home';
import EventNoteIcon from '@material-ui/icons/EventNote';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import HomePage from '../views/Home/HomePage';
import EstadoDeudaPage from '../views/EstadoDeuda/EstadoDeudaPage';
import Pago from '../views/Pagos/Pago.jsx';
import ComerciosResponsablesInscriptosPage from '../views/ComerciosResponsablesInscriptos/ComerciosResponsablesInscriptosPage';
import {getFullUrl, MODO_ANONIMO} from '../core/globals';

const defaultPath = 'inicio';

const routes = [
	{
		path: getFullUrl('inicio'),
		name: 'Inicio',
		component: HomePage,
		public: true,
		icon: HomeIcon,
	},
	{
		path: getFullUrl('estado-deuda'),
		name: 'Estado de Deuda',
		component: EstadoDeudaPage,
		public: MODO_ANONIMO,
		private: !MODO_ANONIMO,
		icon: EventNoteIcon,
	},
	{
		path: getFullUrl('responsables-inscriptos'),
		name: 'Comercio DDJJ',
		component: ComerciosResponsablesInscriptosPage,
		public: false,
		private: true,
		icon: PermContactCalendarIcon,
	},
	{
		path: getFullUrl('estado-deuda-pago'),
		name: 'Pagar Deuda',
		component: Pago,
		public: true,
		private: false,
		notShowOnMenu: true,
	},
	{ redirect: true, path: getFullUrl(), pathTo: getFullUrl(defaultPath), name: 'Estado de Deuda' }
];

export default routes;
