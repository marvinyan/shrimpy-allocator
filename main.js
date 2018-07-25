const EXCLUSIONS = new Set(['Tether']);
const MAX_QUANTITY = 20;

// Remove existing allocations
$$('.remove').forEach(el => el.click());

// Get array of coins
let possAllocs = document.querySelector('.possible-allocations');
let coins = possAllocs.querySelectorAll('.item');
coins = Array.prototype.slice.call(coins)

// Sort coins by rank
coins.sort((a, b) => {
  const rankA = a.querySelector('.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content');
  const rankB = b.querySelector('.item-info-row > .item-info-row-item:first-of-type > .item-info-row-item-content');
  return parseInt(rankA.innerHTML) - parseInt(rankB.innerHTML);
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
