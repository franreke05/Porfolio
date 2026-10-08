import Image, { type StaticImageData } from "next/image";
import loginScreen from "../../capturas-flashfix/01-login.png";
import userDashboardScreen from "../../capturas-flashfix/02-dashboard-usuario.png";
import requestedTrackerScreen from "../../capturas-flashfix/03-tracker-solicitado.png";
import workshopRequestsScreen from "../../capturas-flashfix/04-taller-solicitudes-y-chats.png";
import repairTrackerScreen from "../../capturas-flashfix/05-tracker-en-reparacion.png";
import chatScreen from "../../capturas-flashfix/06-chat.png";
import completedTrackerScreen from "../../capturas-flashfix/07-tracker-completado-valoracion.png";
import darkModeScreen from "../../capturas-flashfix/08-dark-mode.png";
import s from "./flashfix/flashfix.module.css";

type Screen = {
  image: StaticImageData;
  role: string;
  title: string;
  alt: string;
};

const screens: Screen[] = [
  {
    image: loginScreen,
    role: "Acceso",
    title: "Inicio de sesión",
    alt: "Captura real de FlashFix: pantalla de bienvenida con el logotipo y el formulario de inicio de sesión",
  },
  {
    image: userDashboardScreen,
    role: "Conductor",
    title: "Buscar taller",
    alt: "Captura real de FlashFix: buscador de talleres con la ficha de un taller, su dirección y los botones Ver más y Seleccionar",
  },
  {
    image: requestedTrackerScreen,
    role: "Conductor",
    title: "Solicitud enviada",
    alt: "Captura real de FlashFix: seguimiento de una solicitud con los pasos Solicitado, Aceptado, En reparación y Completado",
  },
  {
    image: workshopRequestsScreen,
    role: "Taller",
    title: "Bandeja de solicitudes",
    alt: "Captura real de FlashFix: panel del taller con una solicitud entrante y los botones Aceptar y Rechazar",
  },
  {
    image: repairTrackerScreen,
    role: "Taller",
    title: "Reparación en curso",
    alt: "Captura real de FlashFix: panel del taller con la reparación en curso y el botón Marcar completado",
  },
  {
    image: chatScreen,
    role: "Conductor · Taller",
    title: "Chat",
    alt: "Captura real de FlashFix: conversación entre conductor y taller dentro de la aplicación",
  },
  {
    image: completedTrackerScreen,
    role: "Conductor",
    title: "Valorar el taller",
    alt: "Captura real de FlashFix: reparación completada con el control de estrellas para valorar el taller",
  },
  {
    image: darkModeScreen,
    role: "Tema oscuro",
    title: "La misma pantalla, de noche",
    alt: "Captura real de FlashFix en tema oscuro: seguimiento completado y valoración del taller",
  },
];

/**
 * "Pantallas reales" — the eight real Android captures, inset in the comic
 * as a contact sheet. Server-rendered and always visible (no toggle).
 */
export function FlashFixInterfaceGallery() {
  return (
    <ol className="columns-2 gap-4 sm:gap-6 lg:columns-4">
      {screens.map((screen, i) => (
        <li key={screen.title} className="mb-5 break-inside-avoid sm:mb-7">
          <figure className={`${s.reveal} ${s.caption} p-1.5 sm:p-2`}>
            <Image
              src={screen.image}
              alt={screen.alt}
              sizes="(min-width: 1280px) 270px, (min-width: 1024px) 22vw, 45vw"
              className="h-auto w-full border-2 border-[color:var(--foreground)]"
            />
            <figcaption className="px-1 pb-1 pt-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--primary)]">
                {String(i + 1).padStart(2, "0")} · {screen.role}
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-[color:var(--foreground)]">
                {screen.title}
              </p>
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  );
}
