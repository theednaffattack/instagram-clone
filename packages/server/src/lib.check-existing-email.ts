import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getConnection } from "typeorm";
import { configBuildAndValidate } from "./config.build-config";
import { User } from "./entity.user";

@ValidatorConstraint({ async: true })
export class DoesEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    let config;

    try {
      config = await configBuildAndValidate();
    } catch (error) {
      console.error("ERROR GETTING CONFIG IN 'DOES EMAIL EXIST' CUSTOM CONSTRAINT");
      console.error(error);
      throw Error(error);
    }

    // Must use 'getConnection' here or
    // this will fail in production. Without
    // a specified connection TypeOrm will use
    // 'default'. I now believe 'default' should be
    // tested for and generally avoided, if possible.
    let user;
    try {
      const conn = getConnection(config.env);

      const userRepo = conn.getRepository(User);
      user = await userRepo.findOne({ where: { email } });
    } catch (error) {
      console.error("ERROR SELECTING USER - CHECK EXISTING EMAIL");
      console.error(error);
      throw Error(error);
    }

    return user === undefined;
  }
}

export function DoesEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesEmailAlreadyExistConstraint,
    });
  };
}
