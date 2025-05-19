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

## Login

Para el login, se pide email y contraseña

Este servicio, realiza el login, en el caso de que inicie sesión con éxito, guarda la información en localStorage y la sesión persiste si el administrador refresca la página

Si el email es incorrecto, o no existe o si la contraseña es incorrecta, arroja un error generico 

```
Email o contraseña incorrecta
```

También arroja error si el usuario que intenta loguearse **no** es del tipo **Admin**

```
No tienes permisos para acceder.
```

## Recuperar contraseña

Se utiliza el servicio de reestablecimiento que ofrece Firebase Auth por defecto

El formulario de la app, pide el correo con el cual el usuario se registro, y se recibe las instrucciones por correo

El template del email se puede modificar facilmente desde la pantalla principal de Firebase Auth. Se debe ingresar a 

```
Autenticación > Plantillas > Reestablecer Contraseña
```

En esta pantalla aparece los datos del email, como "remitente", "de", "asunto", el cuerpo del email y "responder a" que por defecto no admite respuestas

En la parte inferior izquierda aparece un desplegable de idioma, el cual permite modificar el idioma del email y la pantalla de reestablecimiento 

```
Idioma de la plantilla
```

En el email se puede observar un link, este link redirige a una pantalla por defecto que brinda Firebase Auth, es un simple formulario donde se ingresa la nueva contraseña, y se envía. La página debería mostrar un mensaje de confirmación "Ahora puedes acceder con tu contraseña nueva"

Este link se puede cambiar por una URL de acción personalizada, por ejemplo alguna URL con un formulario ó otra opción es personalizar el servicio **sendPasswordResetEmail** para que el link abra la app 

## Pantalla de Inicio

Esta pantalla muestra tres componentes principales: 

* Formulario con dos inputs: **Desde** y **Hasta** estos valores son usados para obtener los datos que se muestran en los demás componentes

Cada vez que se modifican estos inputs, se realizan las peticiones a la base de datos para obtener la información dentro del rango de fecha seleccionado

* Estadisticas de los paquetes por estado; contabiliza la cantidad de paquetes en los distintos estados dentro del rango de fecha seleccionado 

* Y por último, la tabla que muestra toda la información sobre los paquetes así como también la información del usuario asociado 

Esta tabla cuenta con paginación desde el servidor (Firebase), obtiene los primeros 100 productos (ordenados por el campo **idRastreo**) mostrando un total de 20 productos por página, una vez que el usuario llega a la página 6, se obtienen los próximos 100 elementos, y así sucesivamente. También se obtiene el número total de elementos dentro de ese rango de fecha, sólo a modo de visualizar la cantidad total de elementos

En el lado superior de la tabla, aparece un input, este permite poder filtrar por sólo por el campo **IdRastreo**. 

También aparece un botón para poder crear nuevos paquetes, este botón abre un modal donde se muestra un formulario multi steps.

Dentro de la tabla, como última columna aparece un botón para poder editar el paquete en cuestión.

Si el administrador selecciona varias columnas de la lista, se puede visualizar al final de la tabla un botón **Editar en Lote**, este botón abre un modal el cual permite editar todas las columnas seleccionadas

### Crear/Editar paquetes 

El formulario multi steps para la edicción o creación de paquetes consta de 3 pasos

* El primero muestra un **Autocomplete** de usuarios, donde el administrador de ingresar el **nombre**, **apellido** ó **lockerCode** del usuario para que se realice la búsqueda y muestre las opciones. La búsqueda se realiza por coincidencia parcial, es decir, si ingreso "jua" mostraría los usuarios con nombre, apellido ó lockerCode que comiencen con "jua"

* El segundo paso es información sobre paquete(s), puede agregar uno ó más, la información que se le pide es la siguiente  **idRastreo**, **vía**, **contenido**, **peso** y **unidad**, **observaciones** y **tarifa** que muestra un listado de las tarifas guardadas de la agencia. Cuando se edita un paquete, aparece un campo más para modificar el **estado** del paquete

* El último paso muestra los detalles; la información del usuario y un listado de paquete(s) a crear/editar 

Una vez enviado el formulario, este llama a una **Firebase Function** llamada **guardarPaquete**

#### Configurar Firebase Function

Lo primero que debe hacer es actualizar el plan de su proyecto a **Blaze**, ya que Firebase no permite usar Function en la versión gratuita

Desde la consola de Firebase, al final del menú lateral figura su plan actual (debería ser **Spark**). Le va a pedir una cuenta de facturación, en caso de que su consumo supere los limites gratuitos

Dentro del repositorio, se creo la carpeta **functions** que contiene un proyecto con las **Firebase Functions**

El primero paso es instalar **Firebase CLI**
```
npm install -g firebase-tools
```

Una vez instalada, debes loguearte, se debe seleccionar la cuenta con la que fue creada el proyecto

```
firebase login
```

Ya logueado, debes hacer compilar, instalar las dependencias y hacer un deploy de las funciones, para esto debes posicionarte dentro de la carpeta **functions**

```
cd functions
npm install
npx eslint . --ext .ts --fix // Corrige errores de estilo o sintaxis
npm run build
```

Por último, sólo resta hacer el deploy 

```
firebase deploy --only functions
```

La función **guardarPaquete** permite crear o actualizar un paquete, manejando validaciones del plan de la agencia y el estado del paquete.

Para la creación, se registra un nuevo paquete con el estado inicial **Recibido**, se registra el primer evento en el historial del rastreo, agrega el campo **createdAt** con fecha y hora de Nicaragua (America/Managua) y si el limite de la agencia es distinto a cero, se valida si la cantidad de paquetes creados para el mes actual es menor a el limite de la suscripción de la agencia. Y por último, si el usuario asociado al paquete contiene **token FCM** se le envía una notificación.

En la actualización, se compara el estado actual y el anterior, si son distintos se agrega un nuevo evento al historial de rastreo, se actualiza el campo **updatedAt** y se le envía al usuario una notificación sobre este cambio.

Las notificaciones sólo son enviadas cuando se modifica el estado del paquete, en la creación se envía siempre y en la edicción sólo si el estado cambio

## Actualización en lote 

Se puede realizar actualiaciones en lote cuando el usuario haya seleccionado una o más filas. Los campos que se puede modificar son **Usuario**, **Estado**, **Vía** y **Tarifa**

Hay una **Cloud Function** para el envío masivo de notificaciones, es decir, una vez actualizado todos los paquetes seleccionados, se le notifica a cada usuario asociado el cambio realizo. Esta funcion es **enviarNotificacionesEnBatch** que basicamente recibe un array de ids de paquetes, obtiene el usuario y le envía la notificación

## Reporte

En la tabla se puede observar un botón con el icono de **PDF** y otro con el icono de **Table**, sólo estaran habilitado si la lista contiene paquetes. Al hacer click en el primero se descarga un pdf con el listado actual con los campos del paquete.

El PDF incluye un header con el nombre de la agencia y el logo. Como nombre incluye las fechas seleccionada, por ejemplo, para las fechas 14/05/2025 a 16/05/2025, el nombre del PDF sería "14_05_2025-16_05_2025.pdf"

En el segundo boton se descargará el mismo archivo pero en formato **.xlsx**, con el mismo **Header** y nombre que el **PDF**