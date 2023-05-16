import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test("Deve validar o fluxo de autenticação", async function () {
    const input = {
        email: "sousa.tarcisio.s@gmail.com",
        password: "abc123",
        date: new Date("2023-05-09T23:18:00")
    }
    await axios.post("http://localhost:3004/signup", input);
    const response = await axios.post("http://localhost:3004/login", input);
    const output = response.data;
    expect(output.token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg1MDgwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aZAgpsXMA6K_lBLKZ2msWZGnRLb6uCMN0tye6SNp4zs");
    const response2 = await axios.post("http://localhost:3004/verify", { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg1MDgwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aZAgpsXMA6K_lBLKZ2msWZGnRLb6uCMN0tye6SNp4zs"});
    const output2 = response2.data;
    expect(output2.email).toBe("sousa.tarcisio.s@gmail.com");
});