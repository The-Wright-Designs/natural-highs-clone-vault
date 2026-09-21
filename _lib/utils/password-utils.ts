const SEQUENCE_LENGTH = 4;

const keyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

function hasRunOfSameCharacter(password: string) {
  for (let index = 0; index <= password.length - SEQUENCE_LENGTH; index++) {
    const slice = password.slice(index, index + SEQUENCE_LENGTH);
    if (slice.split("").every((character) => character === slice[0])) {
      return true;
    }
  }

  return false;
}

function hasAlphanumericRun(password: string) {
  for (let index = 0; index <= password.length - SEQUENCE_LENGTH; index++) {
    const slice = password.slice(index, index + SEQUENCE_LENGTH);

    if (!/^[a-z]+$/.test(slice) && !/^[0-9]+$/.test(slice)) continue;

    let ascending = true;
    let descending = true;

    for (let step = 1; step < slice.length; step++) {
      const difference = slice.charCodeAt(step) - slice.charCodeAt(step - 1);
      if (difference !== 1) ascending = false;
      if (difference !== -1) descending = false;
    }

    if (ascending || descending) return true;
  }

  return false;
}

function hasKeyboardRun(password: string) {
  for (const row of keyboardRows) {
    const reversedRow = row.split("").reverse().join("");

    for (let index = 0; index <= row.length - SEQUENCE_LENGTH; index++) {
      if (password.includes(row.slice(index, index + SEQUENCE_LENGTH))) {
        return true;
      }
      if (
        password.includes(reversedRow.slice(index, index + SEQUENCE_LENGTH))
      ) {
        return true;
      }
    }
  }

  return false;
}

export function hasCommonSequence(password: string) {
  const normalised = password.toLowerCase();

  return (
    hasRunOfSameCharacter(normalised) ||
    hasAlphanumericRun(normalised) ||
    hasKeyboardRun(normalised)
  );
}

export const passwordRequirements = [
  {
    label: "At least 10 characters",
    test: (password: string) => password.length >= 10,
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
  {
    label:
      "No common sequences like 1234, abcd or qwerty or repeated characters like aaaa",
    test: (password: string) => !hasCommonSequence(password),
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
