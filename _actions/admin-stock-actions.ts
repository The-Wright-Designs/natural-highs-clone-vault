"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { createStrainSlug } from "@/_lib/utils/slug-utils";

const GITHUB_API_URL =
  "https://api.github.com/repos/The-Wright-Designs/natural-highs-clone-vault/contents/_data/strains-data.json";

const AUTH_COOKIE = "admin-auth";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

async function isAuthenticated() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value === hashPassword(password);
}

export async function adminLogin(prevState: unknown, formData: FormData) {
  const password = process.env.ADMIN_PASSWORD;
  const submitted = formData.get("password");

  if (!password || submitted !== password) {
    return { error: "Incorrect password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, hashPassword(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/admin",
  });

  return { error: null };
}

export async function checkAdminAuth() {
  return isAuthenticated();
}

export async function updateStock(prevState: unknown, formData: FormData) {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Not authorised, please refresh and log in again" };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { success: false, error: "Server is missing the GitHub token" };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const getResponse = await fetch(GITHUB_API_URL, {
      headers,
      cache: "no-store",
    });

    if (!getResponse.ok) {
      return { success: false, error: "Could not fetch the current stock data" };
    }

    const file = await getResponse.json();
    const strains = JSON.parse(
      Buffer.from(file.content, "base64").toString("utf-8"),
    );

    let changed = false;
    for (const strain of strains) {
      const newValue = formData.has(createStrainSlug(strain.title));
      if (strain.inStock !== newValue) {
        strain.inStock = newValue;
        changed = true;
      }
    }

    if (!changed) {
      return { success: true, error: null };
    }

    const putResponse = await fetch(GITHUB_API_URL, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "chore: update stock (admin)",
        content: Buffer.from(
          JSON.stringify(strains, null, 2) + "\n",
        ).toString("base64"),
        sha: file.sha,
      }),
    });

    if (!putResponse.ok) {
      return { success: false, error: "Could not save the stock changes" };
    }

    return { success: true, error: null };
  } catch {
    return { success: false, error: "Something went wrong, please try again" };
  }
}
