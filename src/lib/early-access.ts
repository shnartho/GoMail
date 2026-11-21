export const employeeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-1,000",
  "1,001-5,000",
  "5,001+",
];
export const providerOptions = [
  "Google Workspace",
  "Microsoft 365",
  "Both Google and Microsoft",
  "Other email provider",
];

export type AccessRequest = {
  name: string;
  email: string;
  company: string;
  employees: string;
  provider: string;
  message: string;
  intent: string;
};
export type AccessErrors = Partial<Record<keyof AccessRequest, string>>;

export function validateAccessRequest(values: AccessRequest): AccessErrors {
  const errors: AccessErrors = {};
  if (values.name.trim().length < 2 || values.name.length > 100)
    errors.name = "Enter your full name (2-100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
    values.email.length > 254
  )
    errors.email = "Enter a valid work email address.";
  if (values.company.trim().length < 2 || values.company.length > 150)
    errors.company = "Enter your company name (2-150 characters).";
  if (!employeeOptions.includes(values.employees))
    errors.employees = "Select your company size.";
  if (!providerOptions.includes(values.provider))
    errors.provider = "Select your current email provider.";
  if (values.message.length > 2000)
    errors.message = "Keep your message under 2,000 characters.";
  return errors;
}
