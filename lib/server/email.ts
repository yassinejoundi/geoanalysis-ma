import "server-only";

import nodemailer from "nodemailer";
import { getPublicSettings } from "@/lib/server/data/admin";

const sender = "notifications.geoanalysis@gmail.com";

type ContactMessage = {
  name: string;
  company: string;
  email: string;
  phone: string;
  date: string;
  type: { fr: string; en: string };
  message: string;
};

export async function sendContactNotification(contact: ContactMessage) {
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password) throw new Error("Gmail App Password is not configured.");

  const settings = await getPublicSettings();
  const testRecipient = process.env.CONTACT_EMAIL_TEST_TO?.trim();
  const recipient = process.env.NODE_ENV !== "production" && testRecipient
    ? testRecipient
    : settings.email;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: sender, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transporter.sendMail({
    from: `GEOANALYSIS <${sender}>`,
    to: recipient,
    replyTo: contact.email,
    subject: "Nouveau message depuis le formulaire de contact",
    text: [
      "Nouveau message reçu sur le site GEOANALYSIS.",
      "",
      `Nom : ${contact.name}`,
      `Entreprise : ${contact.company || "—"}`,
      `Email : ${contact.email}`,
      `Téléphone : ${contact.phone || "—"}`,
      `Type de projet : ${contact.type.fr} / ${contact.type.en}`,
      `Date : ${contact.date}`,
      "",
      "Message :",
      contact.message,
    ].join("\n"),
  });
}
