type ErrorCode =
  | "auth/email-already-in-use"
  | "auth/invalid-email"
  | "auth/weak-password"
  | "auth/missing-password"
  | "auth/operation-not-allowed"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/invalid-credential"
  | "auth/network-request-failed"
  | "auth/too-many-requests"
  | "auth/internal-error"
  | "auth/requires-recent-login";

export default function getCustomErrorMessage(errorCode: string | ErrorCode) {
  const errorMessages = {
    "auth/email-already-in-use":
      "El correo electrónico ya está en uso. Prueba con otro.",
    "auth/invalid-email": "El formato del correo electrónico no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/missing-password": "Debes ingresar una contraseña.",
    "auth/operation-not-allowed":
      "El registro con email y contraseña está deshabilitado.",
    "auth/user-not-found":
      "No hay una cuenta con este correo. Regístrate primero.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Email o contraseña incorrecta",
    "auth/network-request-failed":
      "Error de red. Verifica tu conexión a internet.",
    "auth/too-many-requests": "Demasiados intentos. Inténtalo más tarde.",
    "auth/internal-error": "Ocurrió un error inesperado. Inténtalo de nuevo.",
    "auth/requires-recent-login": "Inicia sesión e intenta nuevamente.",
  };

  if (errorCode in errorMessages) {
    return errorMessages[errorCode as ErrorCode];
  }

  return "Ocurrió un error inesperado.";
}
