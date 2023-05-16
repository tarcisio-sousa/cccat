import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test("Não deve aceitar um pedido com cpf inválido", async function () {
    const input = {
        cpf: "035.932.193-32"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid cpf");
});

test("Deve criar um pedido vazio com cpf válido", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: []
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(0);
});

test("Deve criar um pedido com 3 produtos", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ],
        coupon: "VALE20"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(4872);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto expirado", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ],
        coupon: "VALE10"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
});

test("Não deve criar um pedido com quantidade negativa", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: -1 },
        ],
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid quantity");
});

test("Não deve criar um pedido com item duplicado", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 1, quantity: 1 },
        ],
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Duplicated item");
});

test("Não deve criar um pedido com 1 produto calculando frete", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 1, quantity: 3 },
        ],
        from: "22060030",
        to: "88015600"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(67.35);
    expect(output.total).toBe(3067.35);
});

test("Não deve criar um pedido se o produto tiver alguma dimensão negativa", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 4, quantity: 1 },
        ],
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid dimension");
});

test("Não deve criar um pedido com 1 produto calculando frete com valor  mínimo", async function () {
    const input = {
        cpf: "035.932.193-36",
        items: [
            { idProduct: 3, quantity: 1 },
        ],
        from: "22060030",
        to: "88015600"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

test("Deve listar os produtos", async function () {
    const response = await axios.get("http://localhost:3000/products");
    const output = response.data;
    expect(output).toHaveLength(3);
});