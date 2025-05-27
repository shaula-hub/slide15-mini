// return2Telegram.js
export const initTelegramNavigation = (
  launcherUrl = "https://blogem.ru/game-selector/"
) => {
  // Initialize Telegram WebApp if not already done
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();

    // Show back button
    window.Telegram.WebApp.BackButton.show();

    // Handle back button - return to game launcher
    const handleBackToLauncher = () => {
      window.location.href = launcherUrl;
    };

    window.Telegram.WebApp.BackButton.onClick(handleBackToLauncher);

    // Return cleanup function
    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackToLauncher);
      window.Telegram.WebApp.BackButton.hide();
    };
  }

  // Return empty cleanup function if Telegram WebApp not available
  return () => {};
};

// Alternative: More comprehensive navigation utilities
export const TelegramNavUtils = {
  // Initialize with back to launcher
  initBackToLauncher: (launcherUrl = "https://blogem.ru/game-selector/") => {
    return initTelegramNavigation(launcherUrl);
  },

  // Initialize with custom back action
  initCustomBack: (customBackFunction) => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.BackButton.show();

      window.Telegram.WebApp.BackButton.onClick(customBackFunction);

      return () => {
        window.Telegram.WebApp.BackButton.offClick(customBackFunction);
        window.Telegram.WebApp.BackButton.hide();
      };
    }
    return () => {};
  },

  // Hide back button
  hideBackButton: () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.BackButton.hide();
    }
  },

  // Show alert using Telegram's native alert
  showAlert: (message) => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  },
};

export default initTelegramNavigation;
