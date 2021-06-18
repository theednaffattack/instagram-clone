import { Message } from "postmark";

interface WelcomeMessageProps {
  toEmail: string;
  confirmationUri: string;
}

export const createWelcomeMessage = ({ toEmail, confirmationUri }: WelcomeMessageProps): Message => {
  return {
    From: '"Spotify Clone" <eddie@eddienaff.dev>', // sender address
    To: toEmail, // list of receivers
    Subject: "Welcome to Spotify (Clone)", // Subject line
    TextBody: `Welcome to Spotify (Clone)! Please copy and paste the confirmation link below into the address bar of your preferred web browser to access your account.\n
      Confirmation link: ${confirmationUri}`, // plain text body
    HtmlBody: `<p>Welcome to Spotify (Clone)!
      <p>Click the link below to access your account.</p>
      <p>Confirmation link:</p>
      <a href="${confirmationUri}">${confirmationUri}</a>`, // html body
  };
};
