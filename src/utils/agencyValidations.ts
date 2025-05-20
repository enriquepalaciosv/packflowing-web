import { contarPaquetesDelMes } from "../firebase/firestore/paquetes";
import { Agency } from "../interfaces/Agency";

// Devuelve false si la cantidad de paquetes creados en el mes supera el limite del plan
const validateCreditsAgency = async (agency: Agency | null) => {
    if (!agency) return false;

    // Si el limite es cero puede crear
    if(!agency.suscripcion.limite) return true;

    const cantidadActual = await contarPaquetesDelMes();

    if (agency.suscripcion.limite <= cantidadActual) {
        return false
    } else { 
        return true
    }
};

const validateHasRates = (agency: Agency | null) => {
    if (!agency || !agency.tarifas) return false;
    
    return !!agency.tarifas.length
}

export {
    validateCreditsAgency,
    validateHasRates
};