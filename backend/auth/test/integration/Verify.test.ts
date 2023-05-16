import Verify from "../../src/application/usecase/Verify";

test("Deve verificar um token", async function () {
    const verify = new Verify();
    const payload = await verify.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg0MDAwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.h9bVgWvb3Ty932GmXqjCQPOKK_BeA2C5NRm8jnzMf1Q");
    expect(payload.email).toBe("sousa.tarcisio.s@gmail.com");
})