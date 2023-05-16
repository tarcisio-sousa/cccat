import FreightGatewayHttp from "../../infra/gateway/FreightGatewayHttp";
import AxiosAdapter from "../../infra/http/AxiosAdapter";
import FreightGateway, { Input as FreightInput } from "../gateway/FreightGateway";
import ProductRepository from "../repository/ProductRepository";

export default class SimulateFreight {

    constructor (
        readonly productRepository: ProductRepository,
        readonly freightGateway: FreightGateway = new FreightGatewayHttp(new AxiosAdapter())
    ) {
    }

    async execute (input: Input): Promise<Output> {
        const output: Output = {
            freight: 0
        };
        const freightInput: FreightInput = { items: [] };
        if (input.items) {
            for (const item of input.items) {
                const product = await this.productRepository.getProduct(item.idProduct);
                // const itemFreight = FreightCalculator.calculate(product, item.quantity);
                freightInput.items.push({ width: product.width, height: product.height, length: product.length, weight: product.weight, quantity: item.quantity});
                // output.freight += itemFreight;
            }
        }
        const freightOutput = await this.freightGateway.calculateFreight(freightInput);
        output.freight = freightOutput.freight;
        return output;
    }
}

type Input = {
    items: { idProduct: number, quantity: number }[],
}

type Output = {
    freight: number
}