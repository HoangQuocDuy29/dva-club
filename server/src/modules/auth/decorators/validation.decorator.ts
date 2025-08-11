import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface 
} from 'class-validator';

/**
 * Custom validator for strong password
 */
@ValidatorConstraint({ async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password) return false;
    
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }
}

/**
 * Strong password decorator
 */
export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}

/**
 * Custom validator for volleyball club roles
 */
@ValidatorConstraint({ async: false })
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
  validate(role: string, args: ValidationArguments) {
    const validRoles = ['admin', 'manager', 'coach', 'player', 'viewer'];
    return validRoles.includes(role);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Role must be one of: admin, manager, coach, player, viewer';
  }
}

/**
 * Valid role decorator
 */
export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRoleConstraint,
    });
  };
}
