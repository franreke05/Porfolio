"use client";

import { ChevronDown } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import loginScreen from "../../capturas-flashfix/01-login.png";
import userDashboardScreen from "../../capturas-flashfix/02-dashboard-usuario.png";
import requestedTrackerScreen from "../../capturas-flashfix/03-tracker-solicitado.png";
import workshopRequestsScreen from "../../capturas-flashfix/04-taller-solicitudes-y-chats.png";
import repairTrackerScreen from "../../capturas-flashfix/05-tracker-en-reparacion.png";
import chatScreen from "../../capturas-flashfix/06-chat.png";
import completedTrackerScreen from "../../capturas-flashfix/07-tracker-completado-valoracion.png";
import darkModeScreen from "../../capturas-flashfix/08-dark-mode.png";

type Screen = {
  image: StaticImageData;
  step: string;
  title: string;
  description: string;
  alt: string;
};

const screens: Screen[] = [
  {
    image: loginScreen,
    step: "01 · Acceso",
    title: "Inicio de sesión",
    description: "Una entrada directa al marketplace desde móvil.",
    alt: "Pantalla de bienvenida e inicio de sesión de FlashFix",
  },
  {
    image: userDashboardScreen,
    step: "02 · Búsqueda",
    title: "Talleres cercanos",
    description: "Búsqueda y selección de un taller disponible.",
    alt: "Pantalla de búsqueda de talleres de FlashFix",
  },
  {
    image: requestedTrackerScreen,
    step: "03 · Solicitud",
    title: "Estado en tiempo real",
    description: "Seguimiento claro desde la petición inicial.",
    alt: "Pantalla de seguimiento de una solicitud recién enviada en FlashFix",
  },
  {
    image: workshopRequestsScreen,
    step: "04 · Taller",
    title: "Bandeja de trabajo",
    description: "El taller acepta o rechaza solicitudes y consulta sus chats.",
    alt: "Panel de solicitudes de un taller en FlashFix",
  },
  {
    image: repairTrackerScreen,
    step: "05 · Reparación",
    title: "Trabajo en curso",
    description: "El progreso avanza a la vez para cliente y taller.",
    alt: "Pantalla de seguimiento con una reparación en curso en FlashFix",
  },
  {
    image: chatScreen,
    step: "06 · Mensajes",
    title: "Chat directo",
    description: "La conversación permanece dentro de la aplicación.",
    alt: "Conversación entre cliente y taller dentro de FlashFix",
  },
  {
    image: completedTrackerScreen,
    step: "07 · Cierre",
    title: "Valoración final",
    description: "El usuario puede valorar el servicio al completar la reparación.",
    alt: "Pantalla de reparación completada y valoración del taller en FlashFix",
  },
  {
    image: darkModeScreen,
    step: "08 · Tema oscuro",
    title: "Interfaz adaptable",
    description: "La experiencia se mantiene legible también en oscuro.",
    alt: "Vista de FlashFix en modo oscuro",
  },
];

export function FlashFixInterfaceGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const galleryId = "flashfix-interface-screens";

  return (
    <section
      aria-labelledby="flashfix-interface-title"
      className="comic-ink-outline mb-12 overflow-hidden rounded-xl bg-[color:var(--surface)]"
    >
      <div className="comic-halftone border-b-[3px] border-[color:var(--foreground)] px-5 py-7 sm:px-8 sm:py-8">
        <p className="comic-action-word comic-status-progress text-xs">Producto en uso</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="flashfix-interface-title" className="font-display text-2xl font-bold text-[color:var(--foreground)] sm:text-3xl">
              FlashFix, pantalla a pantalla
            </h2>
            <p className="mt-2 max-w-2xl text-pretty leading-7 text-[color:var(--surface-foreground)]">
              Capturas de la aplicación Android que muestran el recorrido completo: encontrar un taller, solicitar el servicio, conversar y valorar el resultado.
            </p>
          </div>
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={galleryId}
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-4 text-sm font-semibold text-[color:var(--on-primary)] transition-colors hover:bg-[color:var(--primary-hover)] lg:self-auto"
          >
            {isExpanded ? "Ocultar pantallas" : "Ver las 8 pantallas"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div id={galleryId} className="grid gap-6 p-5 sm:grid-cols-2 sm:p-8 xl:grid-cols-4">
        {screens.map((screen, i) => (
          <figure
            key={screen.step}
            className={`group comic-ink-outline rounded-lg bg-[color:var(--background)] p-2 ${
              i % 2 === 0 ? "comic-caption-tag-tilt-a" : "comic-caption-tag-tilt-b"
            }`}
          >
            <div className="overflow-hidden rounded-md border-2 border-[color:var(--foreground)] bg-[#e9eefb]">
              <Image
                src={screen.image}
                alt={screen.alt}
                sizes="(min-width: 1280px) 20vw, (min-width: 640px) 45vw, 92vw"
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]"
              />
            </div>
            <figcaption className="px-1 pb-1 pt-3">
              <p className="comic-action-word comic-status-progress text-[10px]">
                {screen.step}
              </p>
              <h3 className="mt-1 text-base font-semibold text-[color:var(--foreground)]">{screen.title}</h3>
              <p className="mt-1 text-sm leading-5 text-[color:var(--muted)]">{screen.description}</p>
            </figcaption>
          </figure>
        ))}
        </div>
      )}
    </section>
  );
}
