
# Pack Flowing Web

El proyecto está realizado con React, Material UI, Zustand y React Router Dom para el enrutamiento

La pantalla principal, un vez logueado, muestra un menú lateral con los distintos módulos a los cuales el administrador puede acceder como; Inicio, Usuario, Paquetes, entre otros 

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