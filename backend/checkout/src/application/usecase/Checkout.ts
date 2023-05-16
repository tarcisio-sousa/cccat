import CurrencyTable from "../../domain/entity/CurrencyTable";
import Order from "../../domain/entity/Order";
import CatalogGatewayHttp from "../../infra/gateway/CatalogGatewayHttp";
import FreightGatewayHttp from "../../infra/gateway/FreightGatewayHttp";
import StockGatewayHttp from "../../infra/gateway/StockGatewayHttp";
import AxiosAdapter from "../../infra/http/AxiosAdapter";
import Queue from "../../infra/queue/Queue";
import CatalogGateway from "../gateway/CatalogGateway";
import CurrencyGateway from "../gateway/CurrencyGateway";
import FreightGateway, { Input as FreightInput } from "../gateway/FreightGateway";
import StockGateway from "../gateway/StockGateway";
import CouponRepository from "../repository/CouponRepository";
import OrderRepository from "../repository/OrderRepository";
import ProductRepository from "../repository/ProductRepository";
import Usecase from "./Usecase";

export default class Checkout implements Usecase {

    constructor (
        readonly currencyGateway: CurrencyGateway,
        readonly productRepository: ProductRepository,
        readonly couponRepository: CouponRepository,
        readonly orderRepository: OrderRepository,
        readonly freightGateway: FreightGateway = new FreightGatewayHttp(new AxiosAdapter()),
        readonly catalogGateway: CatalogGateway = new CatalogGatewayHttp(new AxiosAdapter()),
        readonly stockGateway: StockGateway = new StockGatewayHttp(new AxiosAdapter()),
        readonly queue?: Queue
    ) {
    }

    async execute (input: Input): Promise<Output> {
        const currencies = await this.currencyGateway.getCurrencies(); 
        const currencyTable = new CurrencyTable();
        currencyTable.addCurrency("USD", currencies.usd);
        const sequence = await this.orderRepository.count();
        const order = new Order(input.uuid, input.cpf, currencyTable, sequence, new Date());
        const freightInput: FreightInput = { items: [], from: input.from, to: input.to };
        if (input.items) {
            for (const item of input.items) {
                // const product = await this.productRepository.getProduct(item.idProduct);
                const product = await this.catalogGateway.getProduct(item.idProduct);
                order.addItem(product, item.quantity);
                // const itemFreight = FreightCalculator.calculate(product, item.quantity);
                freightInput.items.push({ width: product.width, height: product.height, length: product.length, weight: product.weight, quantity: item.quantity });
                // freight += itemFreight;
            }
        }
        const freightOutput = await this.freightGateway.calculateFreight(freightInput);
        const freight = freightOutput.freight;
        if (input.from && input.to) {
            order.freight = freight;
        }
        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }
        let total = order.getTotal();
        await this.orderRepository.save(order);
        // await this.stockGateway.decrementStock(input);
        if (this.queue) {
            await this.queue.publish("decrementStock", input);
        }
        return {
            total,
            freight
        };
    }
}

type Input = {
    uuid?: string,
    cpf: string,
    items: { idProduct: number, quantity: number, price?: number }[],
    coupon?: string,
    from?: string,
    to?: string,
}

type Output = {
    total: number,
    freight: number
}