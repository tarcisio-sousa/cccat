import Email from "../../src/domain/entity/Email";

test("Deve criar um email válido", function () {
    const email = new Email("sousa.tarcisio.s@gmail.com");
    expect(email.value).toBe("sousa.tarcisio.s@gmail.com");
});

test("Deve criar um email inválido", function () {
    expect(() => new Email("sousa.tarcisio.s@gmail")).toThrow(new Error("Invalid email"));
});
