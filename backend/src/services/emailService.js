require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true" ? true : false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Load and compile a Handlebars template
   * @param {string} templateName - Name of the template file (without extension)
   * @param {Object} data - Data to inject into the template
   * @returns {Promise<string>} - Compiled HTML
   */

  async compileTemplate(templateName, data) {
    try {
      const templatePath = path.join(
        __dirname,
        "../email_templates/",
        `${templateName}.hbs`
      );
      const template = await fs.readFile(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(template);
      return compiledTemplate(data);
    } catch (error) {
      logger.error("Error compiling email template", { error, templateName });
      throw new Error(`Failed to compile email template: ${templateName}`);
    }
  }

  async sendEmail({ to, subject, template, data, html, text }) {
    try {
      let finalHtml = html;

      // If template is provided, compile it
      if (template) {
        finalHtml = await this.compileTemplate(template, data || {});
      }

      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM_NAME,
        to,
        subject,
        text,
        html: finalHtml,
      });

      logger.info("Email sent successfully", { messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error("Error sending email", { error });
      throw error;
    }
  }

  // Email templates
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Welcome to OmniBuzz!",
      html: `
        <h1>Welcome to OmniBuzz, ${user.firstName}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
      `,
    });
  }

  async sendBookingConfirmation(booking) {
    return this.sendEmail({
      to: booking.passengerDetails.email,
      subject: "Booking Confirmation - OmniBuzz",
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been confirmed. Booking ID: ${booking.bookingNumber}</p>
        <p>Details:</p>
        <ul>
          <li>From: ${booking.trip.route.startStation.name}</li>
          <li>To: ${booking.trip.route.endStation.name}</li>
          <li>Date: ${new Date(booking.trip.departureDate).toLocaleDateString()}</li>
          <li>Seats: ${booking.seats.join(", ")}</li>
        </ul>
      `,
    });
  }

  async sendVerificationEmail(user, verificationCode) {
    return this.sendEmail({
      to: user.email,
      subject: "Verify your email",
      template: "emailVerification",
      data: {
        name: user.fullName,
        verificationCode,
      },
    });
  }
}

module.exports = new EmailService();
