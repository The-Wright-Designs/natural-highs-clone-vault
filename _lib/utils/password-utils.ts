export const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: "One special character",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

export function getPasswordError(password: string) {
  const failed = passwordRequirements.filter(
    (requirement) => !requirement.test(password),
  );

  if (failed.length === 0) return null;

  return `The new password must meet these requirements: ${failed
    .map((requirement) => requirement.label.toLowerCase())
    .join(", ")}`;
}
