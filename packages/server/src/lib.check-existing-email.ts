import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getConnection } from "typeorm";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";
import { handleAsyncSimple, handleAsyncWithArgs } from "./lib.handle-async";
import { handleCatchBlockError } from "./lib.handle-catch-block-error";

@ValidatorConstraint({ async: true })
export class DoesEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const [config, configError] = await handleAsyncSimple(configBuildAndValidate);

    if (configError) {
      handleCatchBlockError(configError);
    }

    // Must use 'getConnection' here or
    // this will fail in production. Without
    // a specified connection TypeOrm will use
    // 'default'. I now believe 'default' should be
    // tested for and generally avoided, if possible.

    // let user;

    const conn = getConnection(config.env);

    const userRepo = conn.getRepository(User);
    const [user, userError] = await handleAsyncWithArgs(userRepo.findOne, [{ where: { email } }]);
    if (userError) {
      handleCatchBlockError(userError);
    }

    return user === undefined;
  }
}

export function DoesEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesEmailAlreadyExistConstraint,
    });
  };
}
