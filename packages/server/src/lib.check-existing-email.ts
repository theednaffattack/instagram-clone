import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

import { User } from "./entity.user";

@ValidatorConstraint({ async: true })
export class DoesEmailAlreadyExistsConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then((user) => {
      if (user) return false;
      return true;
    });
  }
}

export function DoesEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: DoesEmailAlreadyExistsConstraint,
    });
  };
}
