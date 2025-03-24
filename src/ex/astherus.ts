import type {
  Account,
  Address,
  Hash,
  Hex,
  PublicClient,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
} from "viem";
import { bsc } from "viem/chains";
import { abi } from "../abi/astherus";
import { HermesClient } from "@pythnetwork/hermes-client";
import type { OrderInput } from "../types";
import { Ex, ExConfig } from "./ex";

export class Astherus extends Ex {
  readonly version = "v2";
  readonly contract = "0x1b6F2d3844C6ae7D56ceb3C3643b9060ba28FEb0";
  readonly walletClient: WalletClient;
  readonly publicClient: PublicClient;
  readonly account: Account;
  constructor(exConfig: ExConfig) {
    super(exConfig);
    const { secretKey } = this.exConfig;
    this.account = privateKeyToAccount(secretKey as Hex);
    this.walletClient = createWalletClient({
      account: this.account,
      chain: bsc,
      transport: http(),
    });
    this.publicClient = createPublicClient({
      chain: bsc,
      transport: http(),
    });
  }

  /**
   * Get market data for a specific trading pair
   * @param pairBase The base address of the trading pair
   * @returns The market data for the specified trading pair
   */
  async getMarketData(pairBase: Address) {
    return this.publicClient.readContract({
      address: this.contract,
      abi,
      functionName: "getMarketInfo",
      args: [pairBase],
    });
  }

  /**
   * Query the price for a specific price feed ID
   * @param priceId The price feed ID from https://www.pyth.network/developers/price-feed-ids
   * @returns The latest price update for the specified ID
   */
  async getPrice(priceId: Hash) {
    return this.getPrices([priceId]);
  }

  /**
   * Query prices
   * @param ids An array of price feed IDs from https://www.pyth.network/developers/price-feed-ids
   * @returns An array of the latest price updates for the specified IDs
   */
  async getPrices(ids: Hash[]) {
    const connection = new HermesClient("https://hermes.pyth.network", {});
    return connection.getLatestPriceUpdates(ids);
  }

  // TODO Implement price streaming
  async priceStreaming() {}

  /**
   * Get a list of brokers
   * @param start The starting index for the list of brokers
   * @param length The number of brokers to retrieve
   * @returns A list of brokers
   */
  async getBrokers(start: number = 0, length: number = 10) {
    return this.publicClient.readContract({
      address: this.contract,
      abi,
      functionName: "brokers",
      args: [start, length],
    });
  }

  /**
   * Query specific positions of the account for a given pair base
   * @param pairBase The base address of the trading pair
   * @returns The positions for the specified pair base
   */
  async getPositions(pairBase: Address) {
    return this.publicClient.readContract({
      address: this.contract,
      abi,
      functionName: "getPositionsV2",
      args: [this.account.address, pairBase],
    });
  }

  /**
   * Get the assets of the trader
   * @param tokens An array of token addresses to query
   * @returns The assets for the specified tokens
   */
  async getAssets(tokens: Address[]) {
    return this.publicClient.readContract({
      address: this.contract,
      abi,
      functionName: "traderAssets",
      args: [tokens],
    });
  }

  /**
   * Create a market order
   * @param input The order input parameters
   * @returns The transaction receipt of the market order
   */
  async createMarketOrder(input: OrderInput) {
    const useNative = input.tokenIn === zeroAddress;
    const { request } = await this.publicClient.simulateContract({
      address: this.contract,
      abi,
      functionName: useNative ? "openMarketTradeBNB" : "openMarketTrade",
      args: [
        [
          input.pairBase,
          input.isLong,
          input.tokenIn,
          input.amountIn,
          input.qty,
          input.price,
          input.stopLoss,
          input.takeProfit,
          input.broker,
        ],
      ],
      account: this.account,
      value: useNative ? BigInt(input.amountIn) : BigInt(0),
    });
    return this.walletClient.writeContract(request);
  }

  /**
   * Close a market order
   * @param orderHash The hash of the order to close
   * @returns The transaction receipt of the closed market order
   */
  async closeMarketOrder(orderHash: Hash) {
    const { request } = await this.publicClient.simulateContract({
      address: this.contract,
      abi,
      functionName: "closeTrade",
      args: [orderHash],
      account: this.account,
    });
    return this.walletClient.writeContract(request);
  }

  /**
   * Create a limit order
   * @param input The order input parameters
   * @returns The transaction receipt of the limit order
   */
  async createLimitOrder(input: OrderInput) {
    const useNative = input.tokenIn === zeroAddress;
    const { request } = await this.publicClient.simulateContract({
      address: this.contract,
      abi,
      functionName: useNative ? "openLimitOrderBNB" : "openLimitOrder",
      args: [
        [
          input.pairBase,
          input.isLong,
          input.tokenIn,
          input.amountIn,
          input.qty,
          input.price,
          input.stopLoss,
          input.takeProfit,
          input.broker,
        ],
      ],
      account: this.account,
      value: useNative ? BigInt(input.amountIn) : BigInt(0),
    });
    return this.walletClient.writeContract(request);
  }

  /**
   * Close a limit order
   * @param txhash The transaction hash of the limit order to close
   * @returns The transaction receipt of the closed limit order
   */
  async closeLimitOrder(txhash: Hash) {
    const { request } = await this.publicClient.simulateContract({
      address: this.contract,
      abi,
      functionName: "cancelLimitOrder",
      args: [txhash],
      account: this.account,
    });
    return this.walletClient.writeContract(request);
  }
}
