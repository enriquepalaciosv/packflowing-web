import { Agency } from "../interfaces/Agency";

// Return true is plan
const validateCreditsAgency = (agency: Agency | null) => {
    if (!agency) return false;

    if (agency.suscripcion.plan === "Básico") {
        if (agency.suscripcion.limite > 0) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }

};

const validateHasRates = (agency: Agency | null) => {
    if (!agency) return false;
    
    return !!agency.tarifas.length
}

export {
    validateCreditsAgency,
    validateHasRates
};