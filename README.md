# Pack Flowing Web

El proyecto está realizado con React, Material UI, Zustand y React Router Dom para el enrutamiento

## Crear proyecto en Firebase

Desde la consola de Firebase, crear un nuevo proyecto

Registrar una nueva app (Desde el icono de configuración en la pantalla principal)

```
Configuración del Proyecto > General > Agregar App
```

Una vez registrada la app, se obtienen las credenciales del proyecto. Debería verse así

```
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
```

## Variables de Entorno

Agregar variables de entornos a el archivo .env (Ver .example.env)

```
  REACT_APP_API_KEY=
  REACT_APP_AUTH_DOMAIN=
  REACT_APP_PROJECT_ID=
  REACT_APP_STORAGE_BUCKET=
  REACT_APP_MESSAGING_SENDER_ID=
  REACT_APP_APP_ID=
  REACT_APP_MEASUREMENT_ID=
```

## Correr proyecto local

Clonar repositorio

```
  git clone https://github.com/enriquepalaciosv/packflowing-web.git
  cd packflowing-web
```

Instalar dependencias
```
  npm install
```

Correr el proyecto
```
  npm run start
```

## Pantalla de Inicio 

La pantalla principal, una vez logueado, muestra un menú lateral con los distintos módulos a los cuales el administrador puede acceder como; Inicio, Usuario, Paquetes, entre otros 

Y un menú superior que muestra información sobre el nombre del plan actual de la agencia, atajos y donde podrá cerrar sesión 

El modelo para la base de datos de la agencia es la siguiente 

```
Agencia {
    nombre: string;
    politicaPrivacidad: string;
    contacto: string;
    suscripcion: Suscripcion;
    AI: boolean;
    registrarUsuarios: boolean;
    tarifas: Tarifa[];
}

Suscripcion {
    plan: string;
    limite: number;
}

Tarifa {
    nombre: string;
    monto: number;
    moneda: string;
}
```

Si **agencia.activo = false** la navegación estará deshabilitada y se mostrará en pantalla un mensaje **"Servicio no disponible por el momento."**



<<<<<<< HEAD
=======

>>>>>>> main
## Perfil 

En esta pantalla, los administradores van a poder actualizar información de contacto de la agencia como; número de contacto y el listado de tarifas

El número de contacto es el que se utiliza en la app para contactar a la agencia (botón que redirige al whatsapp de la agencia)

```
contacto: string // Por ejemplo: +505 54545454  
```

Aparece también el listado de tarifas, donde se puede editar las existentes o crear nuevas. La única validación en las tarifas es que puede tener como **monto** el valor de 0 o mayor (por si se quiere brindar tarifas cero). La moneda actualmente solo se puede elegir entre dos valores **USD** ó **C$**

```
Tarifa {
  nombre: string;
  monto: number; // Puede ser igual o mayor a 0
  moneda: "USD" | "C$";
}
```

## Autenticación 

### Registro de usuarios 

Esta funcionalidad sólo estará disponible si **agencia.registrarUsuarios = true**

Se accede desde la página principal, en este caso **Login**, aparece el bóton que redirige a **/register** sólo si la condición anterior se cumple

El modelo en la base de datos para usuarios del tipo administradores es el siguiente

```
Admin {
  countryCode: string
  email: string
  lastName: string
  name: string
  phone: number
  role: "Admin" // valor predeterminado 
}
```
