import User from "../../domain/entity/User";
import UserRepository from "../repository/UserRepository";

export default class Signup {

    constructor (readonly useRepository: UserRepository) {

    }

    async execute (input: Input): Promise<void> {
        const user = await User.create(input.email, input.password);
        await this.useRepository.save(user);
    }
}

type Input = {
    email: string,
    password: string
}