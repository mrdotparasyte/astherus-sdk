import { configDotenv } from "dotenv";
import { Astherus } from "./ex";
import { ASTHERUS_SYMBOLS } from "./constants";
configDotenv();

async function main() {
  const astherus = new Astherus();
  const marketData = await astherus.getMarketData(
    "0xD89aE81e55b1Bd46591CB5555209fdF8fFb43b76"
  );
  console.log("Market Data:", marketData);

  console.log("Supported Symbols: ", ASTHERUS_SYMBOLS);
  const btcPrice = await astherus.getPrice(
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
  );
  console.log("BTC Price:", btcPrice);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    process.exit(1);
  });
