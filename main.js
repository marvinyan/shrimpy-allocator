// ==UserScript==
// @name         Shrimpy Top 20 Allocator
// @version      0.1
// @description  Enhances Shrimpy.io by providing market cap based rebalancing.
// @author       Marvin Yan
// @match        https://www.shrimpy.io/dashboard
// @grant        none
// @namespace https://greasyfork.org/users/128831
// ==/UserScript==

(() => {
  const EXCLUDED_COINS = new Set(['Tether']);
  const MAX_QUANTITY = 20;
  const ALLOCATE_BTN_HTML = `
    <div class="allocation-confirm-button-container" _ngcontent-c7="">
      <button class="normal-button mat-button">
        <span class="mat-button-wrapper">Allocate by Market Cap</span>
      </button>
    </div>
  `;
  const API_TOP_100_COINS = 'https://api.coinmarketcap.com/v2/ticker/?structure=array';

  // Remove existing allocations
  const removeAllocations = () => {
    document.querySelectorAll('.remove').forEach(el => el.click());
  };

  // Select the top 20 coins
  const selectTopCoins = () => {
    // Get array of coins
    const possibleAllocsDiv = document.querySelector('.possible-allocations');
    const coins = Array.from(possibleAllocsDiv.querySelectorAll('.item'));

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

    let count = 0;
    for (let i = 0; count < MAX_QUANTITY; i++) {
      const coinName = coins[i].querySelector('.currency-name').innerHTML.trim();
      if (!EXCLUDED_COINS.has(coinName)) {
        coins[i].click();
        count++;
      }
    }
  };

  const getCMCData = () =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', API_TOP_100_COINS, true);
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });

  const showErrorAlert = ({ status, statusText }) => {
    alert(`Unable to connect to CoinMarketCap. ${status}: ${statusText}`);
  };

  const parseCMCResponse = response => {
    const mappedMarketCaps = new Map();
    const { data } = JSON.parse(response);
    data.forEach(coin => mappedMarketCaps.set(coin.name, coin.quotes.USD.market_cap));
    console.log(mappedMarketCaps);
  };

  const performAllocation = () => {
    removeAllocations();
    selectTopCoins();
    getCMCData()
      .then(parseCMCResponse)
      .catch(showErrorAlert);
  };

  const addCustomBtn = () => {
    const div = document.createElement('div');
    div.innerHTML = ALLOCATE_BTN_HTML.trim();
    const buttonsBar = document.querySelector('.shrimpy-card-buttons');
    div.firstChild.addEventListener('click', performAllocation);
    buttonsBar.insertAdjacentElement('afterbegin', div.firstChild);
  };

  // Add the custom button to the allocations page.
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(mutations => {
    mutations.some(mutation => {
      if (
        typeof mutation.target.className === 'string' &&
        mutation.target.className.includes('rebalance-group')
      ) {
        addCustomBtn();
        return true;
      }
      return false;
    });
  });
  observer.observe(document, config);
})();
