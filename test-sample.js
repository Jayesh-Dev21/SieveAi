// Test file with intentional issues for SieveAi demo

async function fetchUserData(userId) {
  // BUG: No error handling
  const response = await fetch(`https://api.example.com/users/${userId}`);
  const data = await response.json();
  return data.user; // BUG: Potential null/undefined access
}

function calculateTotal(items) {
  let total = 0;
  // BUG: Off-by-one error potential
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// SECURITY: Hardcoded API key
const API_KEY = "sk_live_1234567890abcdefghijklmnop";

// BUG: Event listener leak
function setupListener() {
  document.addEventListener('click', () => {
    console.log('clicked');
  });
  // Never removes listener
}

export { fetchUserData, calculateTotal, setupListener };
