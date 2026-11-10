const { client, sender } = require("./mailtrap");
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE} = require("./emailTemplate")

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    });
    console.log("Verification email sent:", response);
    return response;
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    throw error;
  }
};

const senderWelcomeEmail = async (email, name) => {
  try {
    const recipient = [{ email }];
     
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "a06b1958-85ce-4bb9-bed1-5d88e7f40557",
      template_variables: {
        "company_info_name": "E-commerce App",
        "name": name,
      }
    });
    
    console.log("Welcome email sent successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to send welcome email:", error.message);
    throw error;
  }
};



const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await client.send({
      from: sender,
      to: [{ email }],
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Password reset email sent:", response);
    return response;
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw error;
  }
};

module.exports = { 
  sendVerificationEmail, 
  senderWelcomeEmail,
  sendPasswordResetEmail // Export new function
};

