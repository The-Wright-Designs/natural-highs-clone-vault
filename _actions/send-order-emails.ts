"use server";

import nodemailer from "nodemailer";
import { orderEmailTemplate } from "@/_lib/order-email-template";
import { CartItem } from "@/_types/cart-types";
import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  html: string;
}

export async function sendOrderEmailStaff(
  formData: FormData,
  skipRecaptcha: boolean = false,
): Promise<{ success: boolean; error?: string }> {
  const recaptchaToken = formData.get("recaptchaToken") as string;

  try {
    if (!skipRecaptcha) {
      if (!recaptchaToken) {
        return { success: false, error: "reCAPTCHA verification required" };
      }

      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
      if (!recaptchaResult.success) {
        return {
          success: false,
          error: recaptchaResult.error || "reCAPTCHA verification failed",
        };
      }
    }
    const firstName = formData.get("given-name") as string;
    const lastName = formData.get("family-name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("tel") as string;
    const addressLine1 = formData.get("address-line1") as string;
    const addressLine2 = formData.get("address-line2")
      ? (formData.get("address-line2") as string)
      : "";
    const city = formData.get("address-level2") as string;
    const province = formData.get("address-level1") as string;
    const postalCode = formData.get("postal-code") as string;
    const notes = formData.get("notes")
      ? (formData.get("notes") as string)
      : "";

    const name = `${firstName} ${lastName}`;

    const rawCartData = formData.get("cartData");
    const rawTotalPrice = formData.get("totalPrice");
    const rawDeliveryFee = formData.get("deliveryFee");
    const rawTotalWithDelivery = formData.get("totalWithDelivery");
    const rawOrderNumber = formData.get("orderNumber");

    if (!rawCartData || !rawTotalPrice || !rawOrderNumber) {
      return { success: false, error: "Missing required data" };
    }

    const cartItems = JSON.parse(rawCartData as string) as CartItem[];
    const totalPrice = parseFloat(rawTotalPrice as string);
    const deliveryFee = parseFloat(rawDeliveryFee as string);
    const totalWithDelivery = parseFloat(rawTotalWithDelivery as string);
    const orderNumber = rawOrderNumber as string;

    const sanitizedItems = cartItems.map((item) => ({
      ...item,
      name: item.name,
      id: item.id,
    }));

    const emailHtmlContent = orderEmailTemplate({
      name,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      notes,
      items: sanitizedItems,
      totalPrice,
      deliveryFee,
      totalWithDelivery,
      orderNumber,
      recipientType: "staff",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      requireTLS: true,
    });

    const mailOptions: MailOptions = {
      from: `Natural Highs Clone Vault <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_SEND_TO as string,
      subject: `New Order - ${orderNumber} (Natural Highs Clone Vault)`,
      replyTo: email,
      html: emailHtmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending order email:", error);
    return { success: false, error: "Failed to send order email" };
  }
}

export async function sendOrderEmailCustomer(
  formData: FormData,
  skipRecaptcha: boolean = false,
): Promise<{ success: boolean; error?: string }> {
  const recaptchaToken = formData.get("recaptchaToken") as string;

  try {
    if (!skipRecaptcha) {
      if (!recaptchaToken) {
        return { success: false, error: "reCAPTCHA verification required" };
      }

      const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
      if (!recaptchaResult.success) {
        return {
          success: false,
          error: recaptchaResult.error || "reCAPTCHA verification failed",
        };
      }
    }
    const firstName = formData.get("given-name") as string;
    const lastName = formData.get("family-name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("tel") as string;
    const addressLine1 = formData.get("address-line1") as string;
    const addressLine2 = formData.get("address-line2")
      ? (formData.get("address-line2") as string)
      : "";
    const city = formData.get("address-level2") as string;
    const province = formData.get("address-level1") as string;
    const postalCode = formData.get("postal-code") as string;
    const notes = formData.get("notes")
      ? (formData.get("notes") as string)
      : "";

    const name = `${firstName} ${lastName}`;

    const rawCartData = formData.get("cartData");
    const rawTotalPrice = formData.get("totalPrice");
    const rawDeliveryFee = formData.get("deliveryFee");
    const rawTotalWithDelivery = formData.get("totalWithDelivery");
    const rawOrderNumber = formData.get("orderNumber");

    if (!rawCartData || !rawTotalPrice || !rawOrderNumber) {
      return { success: false, error: "Missing required data" };
    }

    const cartItems = JSON.parse(rawCartData as string) as CartItem[];
    const totalPrice = parseFloat(rawTotalPrice as string);
    const deliveryFee = parseFloat(rawDeliveryFee as string);
    const totalWithDelivery = parseFloat(rawTotalWithDelivery as string);
    const orderNumber = rawOrderNumber as string;

    const sanitizedItems = cartItems.map((item) => ({
      ...item,
      name: item.name,
      id: item.id,
    }));

    const emailHtmlContent = orderEmailTemplate({
      name,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      notes,
      items: sanitizedItems,
      totalPrice,
      deliveryFee,
      totalWithDelivery,
      orderNumber,
      recipientType: "customer",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      requireTLS: true,
    });

    const mailOptions: MailOptions = {
      from: `Natural Highs Clone Vault <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Natural Highs Clone Vault order confirmation - ${orderNumber}`,
      replyTo: "sales@naturalhighs.co.za",
      html: emailHtmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending customer order email:", error);
    return { success: false, error: "Failed to send customer order email" };
  }
}
