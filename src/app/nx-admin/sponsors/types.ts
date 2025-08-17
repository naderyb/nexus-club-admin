export type Sponsor = {
  id: number;
  name: string;
  secteur_activite: string | null;
  phone: string | null;
  email: string | null;
  called: boolean;
  comments: string | null;
  created_at: string;
  contact_person?: string | null;
  contact_position?: string | null;
  email_sent?: boolean;
};

export type CallFilter = "all" | "called" | "pending";
export type EmailFilter = "all" | "sent" | "not_sent";

export type FormData = {
  name: string;
  secteur_activite: string;
  phone: string;
  email: string;
  contact_person: string;
  contact_position: string;
};

export type Stats = {
  total: number;
  called: number;
  emailSent: number;
  pending: number;
};
