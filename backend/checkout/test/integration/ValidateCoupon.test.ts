import Connection from "../../src/infra/database/Connection";
import CouponRepository from "../../src/application/repository/CouponRepository";
import CouponRepositoryDatabase from "../../src/infra/repository/CouponRepositoryDatabase";
import PgPromise from "../../src/infra/database/PgPromiseAdapter";
import ValidateCoupon from "../../src/application/usecase/ValidateCoupon";

let validateCoupon: ValidateCoupon;
let connection: Connection;
let couponRepository: CouponRepository;

beforeEach(function () {
    connection = new PgPromise();
    couponRepository = new CouponRepositoryDatabase(connection);
    validateCoupon = new ValidateCoupon(couponRepository);
});

afterEach(async function () {
    await connection.close();
})

test("Deve validar um cupom de desconto", async function () {
    const input = "VALE20";
    const output = await validateCoupon.execute(input);
    expect(output).toBeTruthy();
});

test("Deve validar um cupom de desconto expirado", async function () {
    const input = "VALE10";
    const output = await validateCoupon.execute(input);
    expect(output).toBeFalsy();
});
