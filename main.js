// ==UserScript==
// @name Shrimpy Top 20 Allocator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhances Shrimpy.io by providing market cap based rebalancing.
// @author       Marvin Yan
// @match        https://www.shrimpy.io/dashboard
// @grant        none
// ==/UserScript==

(() => {
  const EXCLUSIONS = new Set(['Tether']);
  const MAX_QUANTITY = 20;
  const ALLOCATE_BTN_HTML = `
    <div class="allocation-confirm-button-container" _ngcontent-c7="">
      <button class="normal-button mat-button">
        <span class="mat-button-wrapper">Allocate by Market Cap</span>
      </button>
    </div>
  `;

  // Add the custom button to the allocations page.
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (
        typeof mutation.target.className === 'string' &&
        mutation.target.className.includes('rebalance-group')
      ) {
        addCustomBtn();
      }
    });
  });
  observer.observe(document, config);

  const addCustomBtn = () => {
    const div = document.createElement('div');
    div.innerHTML = ALLOCATE_BTN_HTML.trim();
    const buttonsBar = document.getElementsByClassName('shrimpy-card-buttons')[0];
    buttonsBar.insertAdjacentElement('afterbegin', div.firstChild);
  };

  const removeAllocations = () => {
    // Remove existing allocations
    document.getElementsByClassName('.remove').forEach(el => el.click());
  };

  const selectTopCoins = () => {
    // Get array of coins
    let coins = possibleAllocsDiv.getElementsByClassName('.item');
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
      const coinName = coins[i].getElementsByClassName('.currency-name')[0].innerHTML.trim();
      if (!EXCLUSIONS.has(coinName)) {
        coins[i].click();
        count++;
      }
    }
  };

  // POJO for standardizing CMC API response
  class Coin {
    constructor(name, symbol, marketCap) {
      this.name = name;
      this.symbol = symbol;
      this.marketCap = marketCap;
    }
  }
})();
