# Astherus sdk

![https://npm.im/@astherus/sdk](https://img.shields.io/npm/v/@astherus/sdk)
![](https://snyk.io/test/github/mrdotparasyte/astherus-sdk/badge.svg)

### Install

```shell
bun add @astherus/sdk

// or
yarn add @astherus/sdk

// or
npm install @astherus/sdk
```

### Usage

#### Get Price

```typescript
const secretKey = process.env.PRIVATE_KEY!.toString();
const astherus = new Astherus({
  rpcUrl: "https://bsc-dataseed.binance.org/",
  secretKey,
});

// pyth price feed id
// https://www.pyth.network/developers/price-feed-ids
const btcPrice = await astherus.getPrice(
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43"
);
```

#### Create Market Order

```typescript
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
const orderhash = await astherus.createMarketOrder(orderInput);
```

#### Close Market Order

```typescript
const orderhash =
  "0xa5f818886ce4ae8bdcf4a9c889b5e1c20de3817fa61a715a290b42082c08fa8c";
await astherus.closeMarketOrder(orderhash);
```
