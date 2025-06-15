export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" style="background-color: yellow; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
      Subscribe to Notifications
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" style="background-color: red; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">
      Unsubscribe from Notifications
    </button>
  `;
}
