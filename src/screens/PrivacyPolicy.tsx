import React from "react";
import {
  Container,
  Typography,
  Box,
  Toolbar,
  AppBar,
  Link,
} from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <>
      {/* Encabezado y texto */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <AppBar
          position="static"
          color="transparent"
          sx={{ p: 2 }}
          elevation={0}
        >
          <Toolbar>
            <img src="/logo.png" alt="Logo" style={{ width: 60 }} />
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h1"
            fontSize={50}
            fontWeight={900}
            textAlign="center"
          >
            Política de privacidad de Pack Flowing
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            fontWeight={500}
            width="75%"
            marginX="auto"
            lineHeight={1.75}
          >
            En Pack Flowing, nuestra principal prioridad es proteger la
            privacidad de nuestros clientes...
          </Typography>
        </Box>
      </Container>

      {/* Más contenido de la política aquí */}
      <Box
        sx={{
          width: "100%",
          p: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box id="section1" mb={4}>
            <Typography variant="h5" fontWeight={700}>
              Introducción
            </Typography>
            <Typography variant="body1">
              1. Información que recopilamos Recopilamos información personal de
              nuestros clientes con el propósito de ofrecer servicios de
              paquetería eficientes y personalizados. La información que
              recopilamos incluye: 1. Nombre completo: Recopilamos el nombre
              completo de nuestros clientes para identificarlos de manera única
              en nuestros sistemas y proporcionar un servicio personalizado. 2.
              Dirección de correo electrónico: Solicitamos la dirección de
              correo electrónico para comunicarnos con nuestros clientes sobre
              el estado de los envíos, enviar actualizaciones y brindar
              información relevante sobre nuestros servicios. 3. Dirección de
              domicilio: La dirección de domicilio se recopila para asegurar la
              correcta entrega de los paquetes y garantizar la eficiencia en
              nuestro servicio de paquetería. 4. Ubicación en tiempo real: En
              algunos casos, podemos solicitar acceso a la ubicación en tiempo
              real de nuestros clientes a través de la aplicación para ofrecer
              servicios de seguimiento de envíos en vivo y brindar una
              experiencia más personalizada. Sin embargo, el acceso a la
              ubicación en tiempo real es opcional y requerirá el consentimiento
              explícito del cliente. 5. Numero de teléfono Recopilamos el número
              de teléfono para facilitar la comunicación con nuestros clientes,
              brindar notificaciones importantes relacionadas con los envíos y
              ofrecer soporte al cliente de manera eficiente. Esta información
              es fundamental para asegurar la correcta entrega de los paquetes y
              mantener una comunicación efectiva con nuestros clientes. En
              1Click nos comprometemos a tratar esta información con la más alta
              confidencialidad, cumpliendo con todas las normas y regulaciones
              de privacidad y protección de datos.
            </Typography>
          </Box>
          <Box id="section2" mb={4}>
            <Typography variant="h5" fontWeight={700}>
              Introducción
            </Typography>
            <Typography variant="body1">
              1. Información que recopilamos Recopilamos información personal de
              nuestros clientes con el propósito de ofrecer servicios de
              paquetería eficientes y personalizados. La información que
              recopilamos incluye: 1. Nombre completo: Recopilamos el nombre
              completo de nuestros clientes para identificarlos de manera única
              en nuestros sistemas y proporcionar un servicio personalizado. 2.
              Dirección de correo electrónico: Solicitamos la dirección de
              correo electrónico para comunicarnos con nuestros clientes sobre
              el estado de los envíos, enviar actualizaciones y brindar
              información relevante sobre nuestros servicios. 3. Dirección de
              domicilio: La dirección de domicilio se recopila para asegurar la
              correcta entrega de los paquetes y garantizar la eficiencia en
              nuestro servicio de paquetería. 4. Ubicación en tiempo real: En
              algunos casos, podemos solicitar acceso a la ubicación en tiempo
              real de nuestros clientes a través de la aplicación para ofrecer
              servicios de seguimiento de envíos en vivo y brindar una
              experiencia más personalizada. Sin embargo, el acceso a la
              ubicación en tiempo real es opcional y requerirá el consentimiento
              explícito del cliente. 5. Numero de teléfono Recopilamos el número
              de teléfono para facilitar la comunicación con nuestros clientes,
              brindar notificaciones importantes relacionadas con los envíos y
              ofrecer soporte al cliente de manera eficiente. Esta información
              es fundamental para asegurar la correcta entrega de los paquetes y
              mantener una comunicación efectiva con nuestros clientes. En
              1Click nos comprometemos a tratar esta información con la más alta
              confidencialidad, cumpliendo con todas las normas y regulaciones
              de privacidad y protección de datos.
            </Typography>
          </Box>
          <Box id="section3" mb={4}>
            <Typography variant="h5" fontWeight={700}>
              Introducción
            </Typography>
            <Typography variant="body1">
              1. Información que recopilamos Recopilamos información personal de
              nuestros clientes con el propósito de ofrecer servicios de
              paquetería eficientes y personalizados. La información que
              recopilamos incluye: 1. Nombre completo: Recopilamos el nombre
              completo de nuestros clientes para identificarlos de manera única
              en nuestros sistemas y proporcionar un servicio personalizado. 2.
              Dirección de correo electrónico: Solicitamos la dirección de
              correo electrónico para comunicarnos con nuestros clientes sobre
              el estado de los envíos, enviar actualizaciones y brindar
              información relevante sobre nuestros servicios. 3. Dirección de
              domicilio: La dirección de domicilio se recopila para asegurar la
              correcta entrega de los paquetes y garantizar la eficiencia en
              nuestro servicio de paquetería. 4. Ubicación en tiempo real: En
              algunos casos, podemos solicitar acceso a la ubicación en tiempo
              real de nuestros clientes a través de la aplicación para ofrecer
              servicios de seguimiento de envíos en vivo y brindar una
              experiencia más personalizada. Sin embargo, el acceso a la
              ubicación en tiempo real es opcional y requerirá el consentimiento
              explícito del cliente. 5. Numero de teléfono Recopilamos el número
              de teléfono para facilitar la comunicación con nuestros clientes,
              brindar notificaciones importantes relacionadas con los envíos y
              ofrecer soporte al cliente de manera eficiente. Esta información
              es fundamental para asegurar la correcta entrega de los paquetes y
              mantener una comunicación efectiva con nuestros clientes. En
              1Click nos comprometemos a tratar esta información con la más alta
              confidencialidad, cumpliendo con todas las normas y regulaciones
              de privacidad y protección de datos.
            </Typography>
          </Box>
          <Box id="section4" mb={4}>
            <Typography variant="h5" fontWeight={700}>
              Introducción
            </Typography>
            <Typography variant="body1">
              1. Información que recopilamos Recopilamos información personal de
              nuestros clientes con el propósito de ofrecer servicios de
              paquetería eficientes y personalizados. La información que
              recopilamos incluye: 1. Nombre completo: Recopilamos el nombre
              completo de nuestros clientes para identificarlos de manera única
              en nuestros sistemas y proporcionar un servicio personalizado. 2.
              Dirección de correo electrónico: Solicitamos la dirección de
              correo electrónico para comunicarnos con nuestros clientes sobre
              el estado de los envíos, enviar actualizaciones y brindar
              información relevante sobre nuestros servicios. 3. Dirección de
              domicilio: La dirección de domicilio se recopila para asegurar la
              correcta entrega de los paquetes y garantizar la eficiencia en
              nuestro servicio de paquetería. 4. Ubicación en tiempo real: En
              algunos casos, podemos solicitar acceso a la ubicación en tiempo
              real de nuestros clientes a través de la aplicación para ofrecer
              servicios de seguimiento de envíos en vivo y brindar una
              experiencia más personalizada. Sin embargo, el acceso a la
              ubicación en tiempo real es opcional y requerirá el consentimiento
              explícito del cliente. 5. Numero de teléfono Recopilamos el número
              de teléfono para facilitar la comunicación con nuestros clientes,
              brindar notificaciones importantes relacionadas con los envíos y
              ofrecer soporte al cliente de manera eficiente. Esta información
              es fundamental para asegurar la correcta entrega de los paquetes y
              mantener una comunicación efectiva con nuestros clientes. En
              1Click nos comprometemos a tratar esta información con la más alta
              confidencialidad, cumpliendo con todas las normas y regulaciones
              de privacidad y protección de datos.
            </Typography>
          </Box>
        </Box>
        <AppBar
          position="sticky"
          color="default"
          sx={{
            top: 0,
            right: 0,
            width: 100,
            backgroundColor: "#f8f8f8",
            boxShadow: 1,
            zIndex: (theme) => theme.zIndex.appBar,
          }}
        >
          <Toolbar
            sx={{
              gap: 4,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href="#section1" underline="none" color="inherit">
              Introducción
            </Link>
            <Link href="#section2" underline="none" color="inherit">
              Datos recopilados
            </Link>
            <Link href="#section3" underline="none" color="inherit">
              Uso de datos
            </Link>
            <Link href="#section4" underline="none" color="inherit">
              Contacto
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
