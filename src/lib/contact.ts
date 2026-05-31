export type ContactActionStatus =
  | "idle"
  | "success"
  | "validation_error"
  | "provider_error";

export type ContactFieldErrors = Partial<
  Record<
    | "name"
    | "email"
    | "phone"
    | "projectType"
    | "goal"
    | "timeframe"
    | "budget"
    | "message",
    string[]
  >
>;

export type ContactActionState = {
  status: ContactActionStatus;
  message: string;
  fieldErrors?: ContactFieldErrors;
};

export const initialContactState: ContactActionState = {
  status: "idle",
  message: "",
};
