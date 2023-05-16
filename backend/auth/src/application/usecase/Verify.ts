import TokenGenerator from "../../domain/entity/TokenGenerator";

export default class Verify {

    constructor () {

    }

    async execute (token: string): Promise<any> {
        const tokenGenerator = new TokenGenerator("key");
        const newTokenGenerator = tokenGenerator.verify(token);
        return newTokenGenerator;
    }
}