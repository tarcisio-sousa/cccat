import UserRepository from "./application/repository/UserRepository";
import Login from "./application/usecase/Login";
import Signup from "./application/usecase/Signup";
import Verify from "./application/usecase/Verify";
import User from "./domain/entity/User";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";


const httpServer = new ExpressAdapter();

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
const login = new Login(userRepository);
const verify = new Verify();
new HttpController(httpServer, signup, login, verify);
httpServer.listen(3004);