import { CartItem } from "@/_types/cart-types";

interface OrderEmailTemplateProps {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  totalWithDelivery: number;
  orderNumber: string;
  recipientType: "staff" | "customer";
}

export const orderEmailTemplate = ({
  name,
  email,
  phone,
  addressLine1,
  addressLine2,
  city,
  province,
  postalCode,
  notes,
  items,
  totalPrice,
  deliveryFee,
  totalWithDelivery,
  orderNumber,
  recipientType,
}: OrderEmailTemplateProps) => {
  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 0.5rem; border-bottom: 1px solid #e5e5e5;">
          <strong style="color: #353535;">${item.name}</strong>
        </td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #e5e5e5; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #e5e5e5; text-align: right;">
          R${item.price.toFixed(2)}
        </td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #e5e5e5; text-align: right;">
          R${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `,
    )
    .join("");

  const isCustomer = recipientType === "customer";
  const title = isCustomer
    ? "Natural Highs Clone Vault - Order Confirmation"
    : "Natural Highs Clone Vault - New Order";

  return `<html lang="en">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 1rem; color: #353535;">
    <table style="width: 100%; background-color: #66e00b; margin-bottom: 2rem;">
      <tr>
      <td width="60%" style="vertical-align: middle;">
          <h1 style="padding: 0 1rem; color: #353535; margin: 0;">
            ${title}
          </h1>
          <p
            style="padding: 0 1rem; margin: 0.5rem 0 0 0; color: #353535; font-weight: bold;"
          >
            Order Number: ${orderNumber}
          </p>
        </td>
        <td width="40%" style="text-align: right; padding: 1rem;">
          <img
            src="https://real-brides.s3.eu-south-2.amazonaws.com/natural-highs-clone-vault-logo-small.webp"
            style="height: 100px; width: auto;"
            alt="Natural Highs Clone Vault"
          />
        </td>
    </table>

    ${
      isCustomer
        ? `
    <table style="width: 100%; padding: 1rem;">
      <tr>
        <td>
          <p style="font-size: 1rem; color: #353535; margin-bottom: 1.5rem;">
            Thank you for your order, ${
              name.split(" ")[0]
            }! Please follow the instructions below to finalise payment.
          </p>
          <h3 style="font-size: 1.25rem; color: #353535; margin-bottom: 1rem;">Payment Instructions</h3>
          <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
            <p style="font-size: 1rem; font-weight: 500; color: #353535; margin: 0;">
              <strong>Payment Method:</strong> EFT Only<br />
              <strong>Reference:</strong> ${orderNumber}<br />
              <strong>Important:</strong> Use your order number as the payment reference.
            </p>
            <div style="border: 1px solid #e0e0e0; padding: 0.5rem; margin-top: 1rem; border-radius: 4px;">
              <p style="font-size: 1rem; font-weight: 500; color: #353535; margin: 0;">
                <strong>Bank:</strong> FNB<br />
                <strong>Account number:</strong> 63173653883<br />
                <strong>Branch code:</strong> 250655
              </p>
            </div>
          </div>
        </td>
      </tr>
    </table>
    `
        : `
    <table style="width: 100%; padding: 1rem;">
      <tr>
        <td>
          <h3 style="font-size: 1.25rem; color: #353535; margin-bottom: 1.5rem;">Customer Details</h3>
          <p style="font-size: 1rem; margin-top: 0.5rem; font-weight: 500; color: #353535;">
            Name: <span style="font-weight: 200; font-style: italic;">${name}</span>
          </p>
          <p style="font-size: 1rem; font-weight: 500; color: #353535;">
            Email: <span style="font-weight: 200; font-style: italic;">${email}</span>
          </p>
          <p style="font-size: 1rem; font-weight: 500; color: #353535;">
            Phone: <span style="font-weight: 200; font-style: italic;">${phone}</span>
          </p>
          <p style="font-size: 1rem; font-weight: 500; color: #353535;">
            Address: <span style="font-weight: 200; font-style: italic;">${addressLine1}${
              addressLine2 ? `, ${addressLine2}` : ""
            }, ${city}, ${province}, ${postalCode}</span>
          </p>
          ${
            notes
              ? `
              <p style="font-size: 1rem; font-weight: 500; color: #353535;">
                Order Notes:
                <br />
                <span style="font-weight: 200; font-style: italic;">${notes}</span>
              </p>
              `
              : ""
          }
        </td>
      </tr>
    </table>
    `
    }
    <table style="width: 100%; padding: 1rem;">
      <tr>
        <td style="padding-top: 1rem;">
          <h3 style="font-size: 1.25rem; color: #353535; margin-bottom: 1rem;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 0.5rem; text-align: left; color: #353535;">Strain</th>
                <th style="padding: 0.5rem; text-align: center; color: #353535;">Quantity</th>
                <th style="padding: 0.5rem; text-align: right; color: #353535;">Unit Price</th>
                <th style="padding: 0.5rem; text-align: right; color: #353535;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="3" style="padding: 1rem 0.5rem 0.5rem 0.5rem; text-align: right; font-weight: bold; color: #353535;">
                  Subtotal:
                </td>
                <td style="padding: 1rem 0.5rem 0.5rem 0.5rem; text-align: right; color: #353535;">
                  R${totalPrice.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 0.5rem; text-align: right; color: #353535;">
                  Standard delivery:
                </td>
                <td style="padding: 0.5rem; text-align: right; color: #353535;">
                  R${deliveryFee.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 0.5rem 0.5rem 1rem 0.5rem; text-align: right; font-weight: bold; color: #353535;">
                  Total:
                </td>
                <td style="padding: 0.5rem 0.5rem 1rem 0.5rem; text-align: right; font-weight: bold; color: #353535; font-size: 1.25rem;">
                  R${totalWithDelivery.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      ${
        isCustomer
          ? `
      <tr>
        <td style="padding-top: 2rem;">
          <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 1rem; border-radius: 4px;">
            <h3 style="font-size: 1.25rem; color: #353535; margin-top: 0; margin-bottom: 1rem;">Next Steps</h3>
            <p style="font-size: 1rem; color: #353535; margin: 0.5rem 0;">
              1. Payment must be made via EFT using the above banking details and your reference - <strong>${orderNumber}</strong><br />
              2. Your order will only be cut once the payment has cleared in our account<br />
              3. Delivery takes a minimum of 14 days
            </p>
            <p style="font-size: 1rem; color: #353535; margin-top: 1rem; margin-bottom: 0;">
              <strong>Questions?</strong> Feel free to reply to this email.
            </p>
          </div>
        </td>
      </tr>
      `
          : ""
      }
    </table>
  </body>
</html>
`;
};
