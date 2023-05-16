import Checkout from "./application/usecase/Checkout";
import CLIController from "./infra/cli/CLIController";
import CLIHandlerNode from "./infra/cli/CLIHandlerNode";
import PgPromise from "./infra/database/PgPromiseAdapter";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import CouponRepositoryDatabase from "./infra/repository/CouponRepositoryDatabase";
import OrderRepositoryDatabase from "./infra/repository/OrderRespositoryDatabase";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";

const connection = new PgPromise();
const httpClient = new AxiosAdapter();
const currencyGateway = new CurrencyGatewayHttp(httpClient);
const productRepository = new ProductRepositoryDatabase(connection);
const couponRepository = new CouponRepositoryDatabase(connection);
const orderRepository = new OrderRepositoryDatabase(connection);
const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
const handler = new CLIHandlerNode();
new CLIController(handler, checkout);