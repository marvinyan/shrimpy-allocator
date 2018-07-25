import Coin from './models/coin';

const EXCLUSIONS = new Set(['Tether']);
const MAX_QUANTITY = 20;

// Remove existing allocations
document.querySelectorAll('remove').forEach(el => el.click());

// Get array of coins
const possAllocs = document.querySelector('.possible-allocations');
let coins = possAllocs.querySelectorAll('.item');
coins = Array.prototype.slice.call(coins);

// Sort coins by rank
coins.sort((a, b) => {
  const rankA = a.querySelector(
    '.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content'
  );
  const rankB = b.querySelector(
    '.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content'
  );
  return parseInt(rankA.innerHTML, 10) - parseInt(rankB.innerHTML, 10);
});

// Select the top 20 coins
let count = 0;
for (let i = 0; count < MAX_QUANTITY; i++) {
  const coinName = coins[i].querySelector('.currency-name').innerHTML.trim();
  if (!EXCLUSIONS.has(coinName)) {
    coins[i].click();
    count++;
  }
}
