"use server";

import { Resend } from "resend";
import { z } from "zod";
import type { ContactActionState } from "@/lib/contact";
import { siteProfile } from "@/lib/site-data";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indica tu nombre.")
    .max(80, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .email("Indica un email válido.")
    .max(120, "El email es demasiado largo."),
  phone: z.string().trim().max(40, "El teléfono es demasiado largo.").optional(),
  projectType: z
    .string()
    .trim()
    .min(1, "Selecciona el tipo de proyecto.")
    .max(80),
  goal: z
    .string()
    .trim()
    .min(8, "Resume el objetivo con un poco más de detalle.")
    .max(220, "El objetivo es demasiado largo."),
  timeframe: z.string().trim().max(80, "El plazo es demasiado largo.").optional(),
  budget: z
    .string()
    .trim()
    .max(80, "El presupuesto orientativo es demasiado largo.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntame un poco más sobre el proyecto.")
    .max(2000, "El mensaje es demasiado largo."),
});

const getString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function sendContactMessage(
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: getString(formData, "name"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    projectType: getString(formData, "projectType"),
    goal: getString(formData, "goal"),
    timeframe: getString(formData, "timeframe"),
    budget: getString(formData, "budget"),
    message: getString(formData, "message"),
  });

  if (!parsed.success) {
    return {
      status: "validation_error",
      message: "Revisa los campos marcados antes de enviar.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !toEmail || !fromEmail) {
    return {
      status: "provider_error",
      message: `El envío automático todavía no está configurado. Escríbeme directamente a ${siteProfile.email}.`,
    };
  }

  const data = parsed.data;
  const resend = new Resend(resendApiKey);
  const lines = [
    `Nombre: ${data.name}`,
    `Email: ${data.email}`,
    `Teléfono: ${data.phone || "No indicado"}`,
    `Tipo de proyecto: ${data.projectType}`,
    `Objetivo: ${data.goal}`,
    `Plazo: ${data.timeframe || "No indicado"}`,
    `Presupuesto: ${data.budget || "No indicado"}`,
    "",
    data.message,
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; color: #121820; line-height: 1.6;">
      <h1 style="margin: 0 0 16px;">Nuevo contacto desde el portfolio</h1>
      <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Teléfono:</strong> ${escapeHtml(data.phone || "No indicado")}</p>
      <p><strong>Tipo de proyecto:</strong> ${escapeHtml(data.projectType)}</p>
      <p><strong>Objetivo:</strong> ${escapeHtml(data.goal)}</p>
      <p><strong>Plazo:</strong> ${escapeHtml(data.timeframe || "No indicado")}</p>
      <p><strong>Presupuesto:</strong> ${escapeHtml(data.budget || "No indicado")}</p>
      <hr style="border: 0; border-top: 1px solid #E8D7BD; margin: 20px 0;" />
      <p>${escapeHtml(data.message).replaceAll("\n", "<br />")}</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: data.email,
      subject: `[Portfolio] ${data.projectType} - ${data.name}`,
      text: lines.join("\n"),
      html,
    });

    if (result.error) {
      return {
        status: "provider_error",
        message:
          "No he podido enviar el mensaje ahora mismo. Usa el email o WhatsApp y lo reviso manualmente.",
      };
    }

    return {
      status: "success",
      message:
        "Mensaje enviado. Te responderé para concretar la llamada y entender el proyecto.",
    };
  } catch {
    return {
      status: "provider_error",
      message:
        "No he podido enviar el mensaje ahora mismo. Usa el email o WhatsApp y lo reviso manualmente.",
    };
  }
}

export async function submitContactMessage(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  return sendContactMessage(formData);
}
