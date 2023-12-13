import { createStore } from "solid-js/store";

type ValidationError = { [key: string]: string };
type Validator<T> = (value: T) => ValidationError | undefined;
type FieldProperties<T> = {
  value: T;
  validators?: Validator<T>[];
};
type FormValueType = string | number | string[] | undefined;
type FormConfig<T> = {
  [Key in keyof T]: FieldProperties<T[Key]>;
};

const getValidators = <T>(formConfig: FormConfig<T>) => {
  const keys = Object.keys(formConfig) as (keyof T)[];
  const validators = Object.assign(
    {},
    ...keys.map((k) => ({
      [k]: formConfig[k].validators ?? [],
    }))
  );
  return validators as { [Key in keyof T]: Validator<T[Key]>[] };
};

const getValues = <T>(formConfig: FormConfig<T>) => {
  const keys = Object.keys(formConfig) as (keyof T)[];
  const values = Object.assign(
    {},
    ...keys.map((k) => ({
      [k]: formConfig[k].value,
    }))
  );
  return values as { [Key in keyof T]: T[Key] };
};

const getEmptyErrors = <T>(formConfig: FormConfig<T>) => {
  type TKeys = keyof T;
  const keys = Object.keys(formConfig) as TKeys[];
  const errors = {};
  Object.assign(
    errors,
    ...keys.map((k) => ({
      [k]: [],
    }))
  );
  return errors as { [P in TKeys]: ValidationError[] };
};

export function createForm<T extends object>(formConfig: FormConfig<T>) {
  type TKeys = keyof T;
  const [formStore, setFormStore] = createStore(getValues(formConfig));
  const [errorStore, setErrorStore] = createStore(getEmptyErrors(formConfig));
  const validators = getValidators(formConfig);

  const validateAll = () => {
    for (const key in formStore) {
      validate(key);
    }
  };

  const validate = (key: TKeys) => {
    const validatorFns = validators[key];
    const errors: ValidationError[] = [];
    validatorFns.forEach((validator) => {
      const validationResult = validator(formStore[key]);
      validationResult && errors.push(validationResult);
    });
    // @ts-expect-error
    setErrorStore(key, errors);
  };

  const getError = (key: TKeys, errorKey: string) => {
    return errorStore[key].find((err) => errorKey in err)?.[errorKey];
  };

  const setError = (key: TKeys, error: ValidationError) => {
    const fieldErrors = errorStore[key];

    const currentErrorKeys = fieldErrors.flatMap((err) => Object.keys(err));
    for (let errorKey in error) {
      if (currentErrorKeys.includes(errorKey)) continue;

      // @ts-expect-error
      setErrorStore({
        [key]: [...fieldErrors, error],
      });
    }
  };

  const hasError = (key: TKeys, errorKey: string) => {
    const fieldErrors = errorStore[key];
    return fieldErrors.some((err) => errorKey in err);
  };

  const isInvalid = (key: TKeys) => {
    return errorStore[key].length !== 0;
  };

  const isValid = (key: TKeys) => {
    return errorStore[key].length === 0;
  };

  const isFormValid = () => {
    const keys = Object.keys(errorStore) as TKeys[];
    return keys.every(isValid);
  };

  const setValue = (key: TKeys, value: (typeof formStore)[TKeys]) => {
    // @ts-expect-error
    setFormStore(key, value);
    validate(key);
  };

  const setValues = (obj: T) => {
    setFormStore(obj);
  };

  const onSubmit =
    (cb: (formValues: typeof formStore) => void) => (e: Event) => {
      e.preventDefault();
      validateAll();
      if (isFormValid()) {
        cb(formStore);
      }
    };

  const register = (key: TKeys) => {
    return {
      name: key,
      value: formStore[key],
      onInput({ target }: Event) {
        if (!target || !("value" in target)) return;
        setValue(key, target.value as (typeof formStore)[TKeys]);
      },
    };
  };

  const resetForm = () => {
    setFormStore(getValues(formConfig));
    setErrorStore(getEmptyErrors(formConfig));
  };

  return {
    value: formStore,
    error: errorStore,
    validate,
    validateAll,
    getError,
    setError,
    hasError,
    isInvalid,
    isValid,
    isFormValid,
    register,
    setValue,
    setValues,
    onSubmit,
    resetForm,
  };
}

const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
export const Validators = {
  string(value: FormValueType) {
    return typeof value === "string"
      ? undefined
      : { string: "Value should be a string" };
  },
  number(value: FormValueType) {
    return typeof value === "number"
      ? undefined
      : { number: "Value should be a number" };
  },
  boolean(value: FormValueType) {
    return typeof value === "boolean"
      ? undefined
      : { number: "Value should be a boolean" };
  },
  required(value: FormValueType) {
    return value !== undefined && value !== ""
      ? undefined
      : { required: "Value is required" };
  },
  min(minLength: number) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return value.length <= minLength
          ? undefined
          : { min: `Minimum length is ${minLength}` };
      }
      if (typeof value === "number" || typeof value === "bigint") {
        return value <= minLength
          ? undefined
          : { min: `Minimum value is ${minLength}` };
      }
      throw `Can't check min length for type ${typeof value}`;
    };
  },
  max(maxLength: number) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return value.length <= maxLength
          ? undefined
          : { max: `Maximum length is ${maxLength}` };
      }
      if (typeof value === "number" || typeof value === "bigint") {
        return value <= maxLength
          ? undefined
          : { max: `Maximum value is ${maxLength}` };
      }
      throw `Can't check max length for type ${typeof value}`;
    };
  },
  email(value: FormValueType) {
    if (typeof value === "string") {
      return emailRegex.test(value) ? undefined : { email: "Email is invalid" };
    }
    throw `Value of type ${typeof value} can't be validates as email`;
  },
  pattern(regex: RegExp) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return regex.test(value)
          ? undefined
          : { pattern: "Pattern don't match" };
      }
      throw `Value of type ${typeof value} can't matched by regex`;
    };
  },
};
