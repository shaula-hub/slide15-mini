import WebApp from "@twa-dev/sdk";

export const telegramWebApp = WebApp;

export const initTelegramApp = () => {
  // Initialize the web app
  WebApp.ready();

  // Enable closing confirmations if needed
  WebApp.enableClosingConfirmation();

  // You can also expand the web app to fullscreen
  WebApp.expand();
};
