import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

/**
 * Transform string to lowercase
 */
export const ToLowerCase = () =>
  Transform(({ value }: TransformFnParams) => 
    typeof value === 'string' ? value.toLowerCase().trim() : value
  );

/**
 * Transform string to uppercase
 */
export const ToUpperCase = () =>
  Transform(({ value }: TransformFnParams) => 
    typeof value === 'string' ? value.toUpperCase().trim() : value
  );

/**
 * Trim whitespace from string
 */
export const Trim = () =>
  Transform(({ value }: TransformFnParams) => 
    typeof value === 'string' ? value.trim() : value
  );

/**
 * Transform email to lowercase and trim
 */
export const NormalizeEmail = () =>
  Transform(({ value }: TransformFnParams) => 
    typeof value === 'string' ? value.toLowerCase().trim() : value
  );

/**
 * Transform username to lowercase and trim
 */
export const NormalizeUsername = () =>
  Transform(({ value }: TransformFnParams) => 
    typeof value === 'string' ? value.toLowerCase().trim() : value
  );

/**
 * Parse string to number
 */
export const ToNumber = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? value : num;
    }
    return value;
  });

/**
 * Parse string to boolean
 */
export const ToBoolean = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  });
