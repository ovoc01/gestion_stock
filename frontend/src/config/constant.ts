import { AdminNavbarItems, NavBarItems, SimpleUserNavBar } from "./site";



export const NAVBAR_CONFIG = new Map<String, NavBarItems[]>();

NAVBAR_CONFIG.set("Utilisateur", SimpleUserNavBar)
NAVBAR_CONFIG.set('Administrateur', AdminNavbarItems)

export const USER_LANDING_URL = new Map<String, String>();
USER_LANDING_URL.set("Utilisateur", "/magasins")
USER_LANDING_URL.set("Administrateur", "/dashboards")
