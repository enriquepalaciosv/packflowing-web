import {
  AppBar,
  Box,
  Container,
  Grid,
  Link,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const PrivacyPolicy = () => {
  const navRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      setTimeout(() => {
        setIsFixed(window.scrollY >= 350);
      }, 50)
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Encabezado y texto */}
      <Container maxWidth="xl" sx={{ py: 2, px: "2rem", backgroundColor: "#f5f5f5" }}>
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

        <Box sx={{ mt: 2, mb: "4rem", display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h1"
            fontSize={"3.75rem"}
            fontWeight={600}
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
            lineHeight={1.625}
            fontSize="1rem"
            color="#1f2937"
          >

            En Pack Flowing, nuestra principal prioridad es proteger la privacidad de nuestros clientes. Nos
            comprometemos a salvaguardar su información personal y a no compartirla con terceros sin
            su previo consentimiento. Esta política de privacidad describe en detalle cómo recolectamos,
            utilizamos y protegemos la información personal de nuestros clientes, garantizando la
            confidencialidad de nuestros procesos y cumpliendo con los más altos estándares de seguridad
            y privacidad.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent={"center"}>
          <Grid size={{ xs: 8 }}>
            <Section
              id="data-we-collect"
              title="1. Información que recopilamos"
              paragraphs={[
                'Recopilamos información personal de nuestros clientes con el propósito de ofrecer servicios de paquetería eficientes y personalizados. La información que recopilamos incluye:',
              ]}
              listItems={[
                '<b>1. Nombre completo:</b> Recopilamos el nombre completo de nuestros clientes para identificarlos de manera única en nuestros sistemas y proporcionar un servicio personalizado.',
                '<b>2. Dirección de correo electrónico:</b> Solicitamos la dirección de correo electrónico para comunicarnos con nuestros clientes sobre el estado de los envíos, enviar actualizaciones y brindar información relevante sobre nuestros servicios.',
                '<b>3. Dirección de domicilio:</b> La dirección de domicilio se recopila para asegurar la correcta entrega de los paquetes y garantizar la eficiencia en nuestro servicio de paquetería.',
                '<b>4. Ubicación en tiempo real:</b> En algunos casos, podemos solicitar acceso a la ubicación en tiempo real de nuestros clientes a través de la aplicación para ofrecer servicios de seguimiento de envíos en vivo. Este acceso será opcional y con consentimiento explícito.',
                '<b>5. Número de teléfono:</b> Recopilamos el número de teléfono para facilitar la comunicación con nuestros clientes, brindar notificaciones importantes y ofrecer soporte.',
              ]}
              finalParagraph="Esta información es fundamental para asegurar la correcta entrega de los paquetes y mantener una comunicación efectiva. En Pack Flowing nos comprometemos a tratar esta información con la más alta confidencialidad, cumpliendo con todas las normas de privacidad."
            />

            <Section
              id="how-we-use-the-information"
              title="2. Cómo utilizamos la información"
              paragraphs={[
                'La información personal que recopilamos se utiliza con el propósito de ofrecer servicios de paquetería eficientes y personalizados, así como para mejorar la experiencia del cliente.',
              ]}
              listItems={[
                '1. Procesar pedidos',
                '2. Comunicarnos con el cliente sobre el estado del pedido',
                '3. Enviar actualizaciones',
                '4. Enviar promociones',
                '5. Enviar notificaciones y avisos',
                '6. Atención al cliente',
              ]}
              finalParagraph="Nos comprometemos a utilizar esta información de manera responsable, segura y cumpliendo con los más altos estándares de privacidad y seguridad."
            />

            <Section
              id="how-we-protect-the-information"
              title="3. Cómo protegemos la información"
              paragraphs={[
                'En Pack Flowing, la privacidad y seguridad de la información personal de nuestros clientes es una prioridad. Implementamos medidas de seguridad administrativas, físicas y técnicas.',
                'Nos comprometemos a no compartir ni vender información personal con terceros, a menos que sea necesario para nuestros servicios o exigido por ley.',
                'Nuestros clientes pueden estar seguros de que su información personal estará siempre segura. Si tienen preguntas, pueden contactarnos.',
              ]}
            />

            <Section
              id="how-to-access-or-modify-your-information"
              title="4. Cómo acceder o modificar su información"
              paragraphs={[
                'Respetamos el derecho de nuestros clientes a tener control sobre su información personal. Brindamos la posibilidad de acceder o modificar su información desde la app.',
                'Nuestro equipo de atención al cliente está disponible para brindar asistencia y soporte sobre este tema.',
              ]}
            />

            <Section
              id="privacy-policy-changes"
              title="5. Cambios a esta política de privacidad"
              paragraphs={[
                'En Pack Flowing, nos esforzamos por mantener esta política de privacidad actualizada. Nos reservamos el derecho de modificarla en cualquier momento.',
                'Notificaremos los cambios a través de nuestra plataforma.',
                'Si continúa utilizando nuestros servicios tras los cambios, se considerará que acepta los nuevos términos. Recomendamos revisar regularmente esta política.',
              ]}
            />

            <Section
              id="get-in-touch"
              title="6. Contacto"
              paragraphs={[
                'Si tiene alguna pregunta acerca de nuestra Política de Privacidad o sobre cómo utilizamos su información personal, puede comunicarse con nosotros:',
                'Correo electrónico: packflowing@gmail.com',
                'Teléfono: +505 8575 4255',
              ]}
            />
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Box
              ref={navRef}
              sx={{
                mt: isFixed ? 0 : 6,
                position: isFixed ? 'fixed' : 'relative',
                top: isFixed ? 40 : 'auto',
                right: 'auto',
                backgroundColor: 'transparent',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <Typography variant="h6">En esta página</Typography>
              <Stack spacing={1} mt={2} gap=".75rem">
                {[
                  {
                    href: "#data-we-collect",
                    title: "1. Información que recopilamos"
                  },
                  {
                    href: "#how-we-use-the-information",
                    title: "2. Cómo utilizamos la información"
                  },
                  {
                    href: "#how-we-protect-the-information",
                    title: "3. Cómo protegemos la información"
                  },
                  {
                    href: "#how-to-access-or-modify-your-information",
                    title: "4. Cómo acceder o modificar su información"
                  },
                  {
                    href: "#privacy-policy-changes",
                    title: "5. Cambios a esta política de privacidad"
                  },
                  {
                    href: "#get-in-touch",
                    title: "6. Contacto"
                  }
                ].map(linkItem => (
                  <Link sx={{ textDecoration: "none", color: "#6b7280", fontWeight: 600, fontSize: "0.875rem" }} href={linkItem.href}>{linkItem.title}</Link>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>

      </Container>

    </>
  );
};

const Section = ({
  id,
  title,
  paragraphs = [],
  listItems = [],
  finalParagraph = '',
}: {
  id: string;
  title: string;
  paragraphs?: string[];
  listItems?: string[];
  finalParagraph?: string;
}) => (
  <Box id={id} mt={4}>
    <Typography
      variant="h6"
      component="h3"
      gutterBottom
      marginBottom="1rem"
      fontSize="1.5rem"
      fontWeight={600}
    >
      {title}
    </Typography>

    <Stack spacing={2} gap="1rem">
      {paragraphs.map((text, i) => (
        <Typography key={i}>{text}</Typography>
      ))}

      {listItems.length > 0 && (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBlockEnd: "1rem" }}>
              <Typography
                component="span"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </li>
          ))}
        </ul>
      )}
    </Stack>
    {finalParagraph && <Typography>{finalParagraph}</Typography>}
  </Box>
);


export default PrivacyPolicy;