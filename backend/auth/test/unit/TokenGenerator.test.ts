import TokenGenerator from "../../src/domain/entity/TokenGenerator";
import User from "../../src/domain/entity/User";

test("Deve gerar o token do usuário", async function () {
    const user = await User.create("sousa.tarcisio.s@gmail.com", "abc123");
    const expiresIn = 1000000;
    const issueDate = new Date("2023-05-09T23:18:00");
    const tokenGenerator = new TokenGenerator("key");
    const token = tokenGenerator.generate(user, expiresIn, issueDate);
    expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg1MDgwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aZAgpsXMA6K_lBLKZ2msWZGnRLb6uCMN0tye6SNp4zs");
});

test("Deve validar o token do usuário", async function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg1MDgwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aZAgpsXMA6K_lBLKZ2msWZGnRLb6uCMN0tye6SNp4zs";
    const tokenGenerator = new TokenGenerator("key");
    const payload = tokenGenerator.verify(token);
    expect(payload).toBeDefined();
    expect(payload.email).toBe("sousa.tarcisio.s@gmail.com");
});

test("Deve tentar validar o token inválido", async function () {
    const token = "eyJhbGciOiJIUzI1NiIsInR56IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg1MDgwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aZAgpsXMA6K_lBLKZ2msWZGnRLb6uCMN0tye6SNp4zs";
    const tokenGenerator = new TokenGenerator("key");
    expect(() => tokenGenerator.verify(token)).toThrow(new Error("invalid token"));
});