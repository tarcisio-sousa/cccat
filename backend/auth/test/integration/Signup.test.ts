import UserRepository from "../../src/application/repository/UserRepository";
import Login from "../../src/application/usecase/Login";
import Signup from "../../src/application/usecase/Signup";
import User from "../../src/domain/entity/User";

test("Deve criar uma conta para o usuário", async function () {
    const users: any = {};
    const userRepository: UserRepository = {
        async save (user: User): Promise<void> {
            users[user.email.value] = user;
        },
        async get (email: string): Promise<User> {
            return users[email];
        }
    }
    const signup = new Signup(userRepository);
    const input = {
        email: "sousa.tarcisio.s@gmail.com",
        password: "abc123",
        date: new Date("2023-05-09T23:00:00")
    }
    await signup.execute(input);

    const login = new Login(userRepository);
    const output = await login.execute(input);
    expect(output.token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdXNhLnRhcmNpc2lvLnNAZ21haWwuY29tIiwiaWF0IjoxNjgzNjg0MDAwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.h9bVgWvb3Ty932GmXqjCQPOKK_BeA2C5NRm8jnzMf1Q");
})