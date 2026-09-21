"use server";

import { createHash } from "crypto";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { createStrainSlug } from "@/_lib/utils/slug-utils";
import { getPasswordError } from "@/_lib/utils/password-utils";
import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";

const REPO = "The-Wright-Designs/natural-highs-clone-vault";
const STRAINS_PATH = "_data/strains-data.json";
const CONFIG_PATH = "_data/admin-config.json";

const AUTH_COOKIE = "admin-auth";

const githubUrl = (path: string) =>
  `https://api.github.com/repos/${REPO}/contents/${path}`;

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

async function readRepoFile(path: string, token: string) {
  const response = await fetch(githubUrl(path), {
    headers: githubHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const file = await response.json();
  return {
    sha: file.sha as string,
    content: JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8"),
    ),
  };
}

async function writeRepoFile(
  path: string,
  token: string,
  content: unknown,
  sha: string,
  message: string,
) {
  const response = await fetch(githubUrl(path), {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message,
      content: Buffer.from(
        JSON.stringify(content, null, 2) + "\n",
      ).toString("base64"),
      sha,
    }),
  });

  return response.ok;
}

async function getStoredPasswordHash() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const file = await readRepoFile(CONFIG_PATH, token);
  const storedHash = file?.content?.passwordHash;

  return typeof storedHash === "string" && storedHash.length > 0
    ? storedHash
    : null;
}

function sessionToken(passwordHash: string) {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return createHash("sha256").update(passwordHash + secret).digest("hex");
}

async function currentSessionToken() {
  const storedHash = await getStoredPasswordHash();
  if (storedHash) return sessionToken(storedHash);

  const fallback = process.env.ADMIN_PASSWORD;
  return fallback ? sessionToken(fallback) : null;
}

async function verifyPassword(submitted: string) {
  const storedHash = await getStoredPasswordHash();

  if (storedHash) return compare(submitted, storedHash);

  const fallback = process.env.ADMIN_PASSWORD;
  return Boolean(fallback) && submitted === fallback;
}

async function isAuthenticated() {
  const expected = await currentSessionToken();
  if (!expected) return false;

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === expected;
}

async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/admin",
  });
}

export async function adminLogin(prevState: unknown, formData: FormData) {
  const submitted = formData.get("password");
  const recaptchaToken = formData.get("recaptchaToken");

  if (typeof recaptchaToken !== "string" || !recaptchaToken) {
    return { error: "Security verification failed, please refresh and retry" };
  }

  const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
  if (!recaptchaResult.success) {
    return { error: "Security verification failed, please refresh and retry" };
  }

  if (typeof submitted !== "string" || !(await verifyPassword(submitted))) {
    return { error: "Incorrect password" };
  }

  const token = await currentSessionToken();
  if (!token) {
    return { error: "Server is not configured for admin login" };
  }

  await setSessionCookie(token);

  return { error: null };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: AUTH_COOKIE, path: "/admin" });
}

export async function checkAdminAuth() {
  return isAuthenticated();
}

export async function changePassword(prevState: unknown, formData: FormData) {
  if (!(await isAuthenticated())) {
    return {
      success: false,
      error: "Not authorised, please refresh and log in again",
    };
  }

  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return { success: false, error: "Please fill in every field" };
  }

  if (!(await verifyPassword(currentPassword))) {
    return { success: false, error: "Current password is incorrect" };
  }

  const passwordError = getPasswordError(newPassword);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "The new passwords do not match" };
  }

  if (newPassword === currentPassword) {
    return {
      success: false,
      error: "The new password must be different to the current one",
    };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { success: false, error: "Server is missing the GitHub token" };
  }

  try {
    const file = await readRepoFile(CONFIG_PATH, token);
    if (!file) {
      return { success: false, error: "Could not fetch the admin settings" };
    }

    const newHash = await hash(newPassword, 10);

    const saved = await writeRepoFile(
      CONFIG_PATH,
      token,
      { ...file.content, passwordHash: newHash },
      file.sha,
      "chore: update admin password",
    );

    if (!saved) {
      return { success: false, error: "Could not save the new password" };
    }

    await setSessionCookie(sessionToken(newHash));

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Something went wrong, please try again" };
  }
}

export async function getStrains() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const file = await readRepoFile(STRAINS_PATH, token);
    if (!file) return null;

    return (file.content as { title: string; inStock: boolean }[])
      .filter((strain) => strain.title !== "")
      .map(({ title, inStock }) => ({ title, inStock }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch {
    return null;
  }
}

export async function updateStock(prevState: unknown, formData: FormData) {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Not authorised, please refresh and log in again" };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { success: false, error: "Server is missing the GitHub token" };
  }

  try {
    const file = await readRepoFile(STRAINS_PATH, token);
    if (!file) {
      return { success: false, error: "Could not fetch the current stock data" };
    }

    const strains = file.content;

    let changed = false;
    for (const strain of strains) {
      if (!strain.title) continue;

      const newValue = formData.has(createStrainSlug(strain.title));
      if (strain.inStock !== newValue) {
        strain.inStock = newValue;
        changed = true;
      }
    }

    if (!changed) {
      return { success: true, error: null };
    }

    const saved = await writeRepoFile(
      STRAINS_PATH,
      token,
      strains,
      file.sha,
      "chore: update stock (admin)",
    );

    if (!saved) {
      return { success: false, error: "Could not save the stock changes" };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Something went wrong, please try again" };
  }
}
