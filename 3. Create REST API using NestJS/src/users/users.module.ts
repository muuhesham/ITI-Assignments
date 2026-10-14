import { Module } from "@nestjs/common";
import { UserController } from "./users.controller.js";
import { UserService } from "./users.service.js";
import { MongooseModule} from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema.js";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema:UserSchema}]),
    ],
    exports: [UserService, MongooseModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule{};