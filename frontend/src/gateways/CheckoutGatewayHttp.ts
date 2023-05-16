import Order from "../entities/Order";
import Product from "../entities/Product";
import HttpClient from "../infra/http/HttpClient";
import CheckoutGateway from "./CheckoutGateway";

export default class CheckoutGatewayHttp implements CheckoutGateway {

    constructor (readonly httpClient: HttpClient, readonly baseUrl: string) {
        
    }

    async getProducts(): Promise<Product[]> {
        const productsData = await this.httpClient.get(`${this.baseUrl}/products`);
        const products: Product[] = [];
        for (const prodcutData of productsData) {
            products.push(new Product(prodcutData.idProduct, prodcutData.description, prodcutData.price));
        }
        return products;
    }

    async checkout(order: Order): Promise<any> {
        return this.httpClient.post(`${this.baseUrl}/checkout`, order);
    }
}