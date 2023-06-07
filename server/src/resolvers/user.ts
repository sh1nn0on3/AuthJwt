import { User } from "../entities/User";
import { RegisterInput } from "../types/RegisterInput";
import { Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { TreeLevelColumn } from "typeorm";

@Resolver()
export class UserResolver {
  @Mutation()
  async register(registerInput: RegisterInput) {
    const { username, password } = registerInput;

    const existingUser = await User.findOne({
      where: {
        username,
      },
    });

    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: "Duplicat username",
      };
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = User.create({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    return {
      code: 200,
      success: true,
      message: "User registeration",
    };
  }
}
