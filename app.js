const coins = {
  bitcoin: {
    moons: [100000, 250000, 1000000],
  },
  ethereum: {
    moons: [2500, 10000, 100000],
  },
  ripple: {
    moons: [1, 2.5, 5],
  },
  "bitcoin-cash": {
    moons: [1000, 5000, 10000],
  },
  cardano: {
    moons: [1, 10, 25],
  },
  "bitcoin-cash-sv": {
    moons: [1000, 5000, 10000],
  },
  litecoin: {
    moons: [1000, 5000, 10000],
  },
  chainlink: {
    moons: [50, 250, 1000],
  },
  "binance-usd": {
    moons: [100, 500, 2500],
  },
  "crypto-com-chain": {
    moons: [1, 5, 25],
  },
};

/**
 * @author Salam A
 * https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
 *
 * Format number into readable number
 */
function nFormatter(num, digits = 2) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

const getMarketCap = (price, supply) => price * supply;

const getCoin = async (coinId) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false`
  );

  if (res.status !== 200) {
    console.error("CoinGecko API request failed.");
    return null;
  }

  return await res.json();
};

const getCoins = async () => {
  for (const coinId in coins) {
    const coin = await getCoin(coinId);
    coins[coinId].data = coin;

    const supply =
      coin.market_data.circulating_supply || coin.market_data.total_supply;

    const li = document.createElement("tr");
    li.innerHTML = `
      <td class="coin-name">
        <img src="${coin.image.thumb}" />
        <h2>${coin.name}</h2>
      </td>
    `;

    const { moons } = coins[coinId];
    if (moons.length) {
      for (let i = 0; i < moons.length; i++) {
        li.innerHTML += `
          <td>
            <div class="coin-moon">
              <span class="coin-moon-price">$${nFormatter(moons[i])}</span>
              <span class="coin-moon-mcap">$${nFormatter(
                getMarketCap(supply, moons[i])
              )}</span>
            </div>
          </td>
        `;
      }
    }

    li.innerHTML += `<td class="center">${nFormatter(supply)}</td>`;

    document.querySelector("#coins").appendChild(li);
  }
};

getCoins();

const priceInput = document.getElementById("price-input");
const supplyInput = document.getElementById("supply-input");
const mcapInput = document.getElementById("mcap-input");

const updateMCapInput = () => {
  mcapInput.value = getMarketCap(priceInput.value, supplyInput.value);
};

priceInput.addEventListener("input", updateMCapInput);
supplyInput.addEventListener("input", updateMCapInput);
