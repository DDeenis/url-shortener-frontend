import { createSignal } from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";

type ValidationError = { type: string; message?: string };
type Validator<TValue, TState> = (
  value: TValue | undefined | null,
  formState: TState
) => ValidationError | undefined;
type FormValueType =
  | string
  | number
  | string[]
  | boolean
  | Date
  | FileList
  | undefined
  | null;

interface FormConfig<TFields> {
  defaultValues?: Partial<TFields>;
}
interface RegisterOptions<TValue, TState> {
  required?: boolean;
  name?: string;
  validators?: Validator<TValue, TState>[];
  onInput?: (value: TValue) => void;
}
type RegisterReturnValues<TFields, T extends keyof TFields> = {
  name: string | keyof TFields;
  value: TFields[T] | undefined;
  required: boolean;
  onInput({ target }: InputEvent): void;
};

export function createForm<
  TFields extends Record<string, FormValueType> = never
>(formConfig?: FormConfig<TFields>) {
  type TKeys = keyof TFields;
  type TState = { [TField in TKeys]?: TFields[TField] | null | undefined };
  const [formStore, setFormStore] = createStore<TState>(
    formConfig?.defaultValues
  );
  const [errorStore, setErrorStore] =
    createStore<{ [TField in TKeys]?: ValidationError[] }>();
  const [validators, setValidators] = createSignal<{
    [TField in TKeys]?: Validator<TFields[TField] | undefined, TState>[];
  }>({});

  const validateAll = () => {
    for (const key in formStore) {
      validate(key);
    }
  };

  const validate = (key: TKeys) => {
    const validatorFns = validators()[key];
    const errors: ValidationError[] = [];
    validatorFns?.forEach((validator) => {
      const validationResult = validator(formStore[key], formStore);
      validationResult && errors.push(validationResult);
    });

    setErrorStore(
      produce((store) => {
        store[key] = errors;
      })
    );
  };

  const getError = (key: TKeys, errorKey: string) => {
    return errorStore[key]?.find((err) => errorKey in err);
  };

  const setError = (key: TKeys, error: ValidationError) => {
    const fieldErrors = errorStore[key] ?? [];

    const currentErrorTypes = fieldErrors.map((error) => error.type);
    if (currentErrorTypes.includes(error.type)) return;

    setErrorStore(
      produce((store) => {
        store[key] = [...fieldErrors, error];
      })
    );
  };

  const hasError = (key: TKeys, errorKey: string) => {
    const fieldErrors = errorStore[key] ?? [];
    return fieldErrors.some((err) => errorKey in err);
  };

  const isInvalid = (key: TKeys) => {
    const errors = errorStore[key];
    return errors !== undefined && errors.length !== 0;
  };

  const isValid = (key: TKeys) => {
    const errors = errorStore[key];
    return errors === undefined || errors.length === 0;
  };

  const isFormValid = () => {
    const keys = Object.keys(errorStore) as TKeys[];
    return keys.every(isValid);
  };

  const setValue = <T extends TKeys>(key: T, value: TFields[T]) => {
    setFormStore(
      produce((store) => {
        store[key] = value;
      })
    );

    validate(key);
  };

  const setValues = (obj: Partial<TFields>) => {
    setFormStore(obj);
  };

  const onSubmit = (cb: (formValues: TState) => void) => (e: Event) => {
    e.preventDefault();
    validateAll();

    if (isFormValid()) {
      cb(formStore);
    }
  };

  const register = <T extends TKeys>(
    key: T,
    options?: RegisterOptions<TFields[T], TState>
  ): RegisterReturnValues<TFields, T> => {
    const validators = options?.validators ?? [];
    options?.required && validators.push(Validators.required);

    setValidators((store) => ({ ...store, [key]: validators }));

    if (options?.required && !(key in formStore)) {
      setFormStore(
        produce((store) => {
          store[key] = null;
        })
      );
    }

    return {
      name: options?.name ?? (key as TKeys),
      value: formStore[key] ?? undefined,
      required: options?.required ?? false,
      onInput({ target }: InputEvent) {
        const t = target as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null;

        if (!t) return;

        let value: unknown = t.value;

        // handle multiple <input> types
        if (t.type === "number" || t.type === "range") {
          value = (t as HTMLInputElement).valueAsNumber;
        } else if (
          t.type === "date" ||
          t.type === "datetime-local" ||
          t.type === "week" ||
          t.type === "month" ||
          t.type === "time"
        ) {
          value = (t as HTMLInputElement).valueAsDate;
        } else if (t.type === "checkbox") {
          value = (t as HTMLInputElement).checked;
        } else if (t.type === "file") {
          value = (t as HTMLInputElement).files;
        }

        setValue(key, value as TFields[typeof key]);
        options?.onInput?.(value as TFields[typeof key]);
      },
    };
  };

  const registerMany = <T extends TKeys>(
    handlers: { key: T; options?: RegisterOptions<TFields[T], TState> }[]
  ) => {
    return handlers.map((h) => register(h.key, h.options));
  };

  const resetForm = () => {
    setFormStore(reconcile({}));
    setErrorStore(reconcile({}));
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
    registerMany,
    setValue,
    setValues,
    onSubmit,
    resetForm,
  };
}

const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const Validators = {
  string(value: FormValueType) {
    return typeof value === "string"
      ? undefined
      : { type: "string", message: "Value should be a string" };
  },
  number(value: FormValueType) {
    return typeof value === "number"
      ? undefined
      : { type: "number", message: "Value should be a number" };
  },
  boolean(value: FormValueType) {
    return typeof value === "boolean"
      ? undefined
      : { type: "boolean", message: "Value should be a boolean" };
  },
  required(value: FormValueType) {
    return value !== undefined && value !== null && value !== ""
      ? undefined
      : { type: "required", message: "Value is required" };
  },
  min(minLength: number) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return value.length <= minLength
          ? undefined
          : { type: "min", message: `Minimum length is ${minLength}` };
      } else if (typeof value === "number" || typeof value === "bigint") {
        return value <= minLength
          ? undefined
          : { type: "min", message: `Minimum value is ${minLength}` };
      } else if (value) {
        throw `Can't check min length for type ${typeof value}`;
      }
    };
  },
  max(maxLength: number) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return value.length <= maxLength
          ? undefined
          : { type: "max", message: `Maximum length is ${maxLength}` };
      } else if (typeof value === "number" || typeof value === "bigint") {
        return value <= maxLength
          ? undefined
          : { type: "max", message: `Maximum value is ${maxLength}` };
      } else if (value) {
        throw `Can't check max length for type ${typeof value}`;
      }
    };
  },
  email(value: FormValueType) {
    if (typeof value === "string") {
      return emailRegex.test(value)
        ? undefined
        : { type: "email", message: "Email is invalid" };
    } else if (value) {
      throw `Value of type ${typeof value} can't be validates as email`;
    }
  },
  url(value: FormValueType) {
    if (typeof value === "string") {
      return urlRegex.test(value)
        ? undefined
        : { type: "url", message: "URL is invalid" };
    } else if (value) {
      throw `Value of type ${typeof value} can't be validates as URL`;
    }
  },
  pattern(regex: RegExp) {
    return (value: FormValueType) => {
      if (typeof value === "string") {
        return regex.test(value)
          ? undefined
          : { type: "pattern", message: "Pattern don't match" };
      } else if (value) {
        throw `Value of type ${typeof value} can't matched by regex`;
      }
    };
  },
};
