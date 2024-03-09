import { EmailContent, NotificationType } from "./../../types/index";
import { EmailProductInfo } from "@/types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  service: "hotmail",
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  maxConnections: 1,
});

const notif = {
  WELCOME: "WELCOME",
  CHANGE_OF_STOCk: "CHANGE_OF_STOCK",
  LOWEST_PRICE: "LOWEST_PRICE",
  THRESHOLD_MET: "THRESHOLD_MET",
};

export const generateMailBody = (
  product: EmailProductInfo,
  type: NotificationType
): EmailContent => {

  const shortenedTitle =
    product.title.length > 20
      ? `${product.title.substring(0, 20)}...`
      : product.title;
  
  const THRESHOLD_PERCENTAGE = 40;

  switch (type) {
    case notif.WELCOME:
      return {
        subject: `Welcome to Price Tracking for ${shortenedTitle}`,
        body: `
          <div>
            <h2>Welcome to PriceWise 🚀</h2>
            <p>You are now tracking ${product.title}.</p>
            <p>Here's an example of how you'll receive updates:</p>
            <div style="border: 1px solid #ccc; padding: 10px; background-color: #f8f8f8;">
              <h3>${product.title} is back in stock!</h3>
              <p>We're excited to let you know that ${product.title} is now back in stock.</p>
              <p>Don't miss out - <a href="${product.url}" target="_blank" rel="noopener noreferrer">buy it now</a>!</p>
              <img src="https://i.ibb.co/pwFBRMC/Screenshot-2023-09-26-at-1-47-50-AM.png" alt="Product Image" style="max-width: 100%;" />
            </div>
            <p>Stay tuned for more updates on ${product.title} and other products you're tracking.</p>
          </div>
        `,
      };
    case notif.CHANGE_OF_STOCk:
      return {
        subject: `${shortenedTitle} is now back in stock!`,
        body: `
        <div>
          <h4>Hey, ${product.title} is now restocked! Grab yours before they run out again!</h4>
          <p>See the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
        </div>
      `,
      };
    case notif.LOWEST_PRICE:
      return {
        subject: `Lowest Price Alert for ${shortenedTitle}`,
        body: `
        <div>
          <h4>Hey, ${product.title} has reached its lowest price ever!!</h4>
          <p>Grab the product <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a> now.</p>
        </div>
      `,
      };
    case notif.THRESHOLD_MET:
      return {
        subject: `Discount Alert for ${shortenedTitle}`,
        body: `
          <div>
            <h4>Hey, ${product.title} is now available at a discount more than ${THRESHOLD_PERCENTAGE}%!</h4>
            <p>Grab it right away from <a href="${product.url}" target="_blank" rel="noopener noreferrer">here</a>.</p>
          </div>
        `,
      };
    default:
      throw new Error("Invalid notification type.");
  }
};

export const sendEmail = async (content: EmailContent, sendTo: string[]) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: sendTo,
    html: content.body,
    subject: content.subject
  }

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) return console.log(error)
    
    console.log('Email sent : ', info);
  })
}
