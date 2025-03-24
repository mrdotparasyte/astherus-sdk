import { configDotenv } from "dotenv";
import { Astherus } from "./ex";
import { ASTHERUS_SYMBOLS } from "./constants";
import { Address, parseEther, parseUnits } from "viem";
configDotenv();

async function main() {
  const secretKey = process.env.PRIVATE_KEY?.toString() || "";

  console.log("Supported Symbols: ", ASTHERUS_SYMBOLS);

  const astherus = new Astherus({
    rpcUrl: "https://bsc-dataseed.binance.org/",
    secretKey,
  });
  const marketData = await astherus.getMarketData(
    "0xD89aE81e55b1Bd46591CB5555209fdF8fFb43b76"
  );
  console.log("Market Data:", marketData);

  const btcPrice = await astherus.getPrice(
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
  );
  console.log("BTC Price:", btcPrice);

  const orderInput = {
    pairBase: "0xD89aE81e55b1Bd46591CB5555209fdF8fFb43b76" as Address,
    isLong: true,
    tokenIn: "0x0000000000000000000000000000000000000000" as Address,
    amountIn: parseEther("0.01"),
    qty: parseUnits("0.01", 10),
    price: parseUnits("86000", 8),
    stopLoss: BigInt(0),
    takeProfit: parseUnits("91000", 8),
    broker: BigInt(2),
  };
  const o1hash = await astherus.createMarketOrder(orderInput);
  await astherus.closeMarketOrder(o1hash);

  const o2hash = await astherus.createLimitOrder(orderInput);
  await astherus.closeLimitOrder(o2hash);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    process.exit(1);
  });
