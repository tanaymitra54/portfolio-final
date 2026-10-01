import { api } from "encore.dev/api";
import { portfolioDB } from "./db";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface SubmitContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Submits a contact form message.
export const submitContact = api<SubmitContactRequest, ContactMessage>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    const row = await portfolioDB.queryRow<{
      id: number;
      name: string;
      email: string;
      subject: string | null;
      message: string;
      read: boolean;
      created_at: Date;
    }>`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${req.name}, ${req.email}, ${req.subject || null}, ${req.message})
      RETURNING id, name, email, subject, message, read, created_at
    `;

    if (!row) {
      throw new Error("Failed to submit contact message");
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      read: row.read,
      createdAt: row.created_at,
    };
  }
);
