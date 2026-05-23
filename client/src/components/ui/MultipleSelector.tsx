import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: unknown;
};

type GroupOption = {
  [key: string]: Option[];
};

type MultipleSelectorRef = {
  selectedValue: Option[];
  input: HTMLInputElement | null;
  focus: () => void;
};

type MultipleSelectorProps = {
  value?: Option[];
  onChange?: (options: Option[]) => void;
  placeholder?: string;

  defaultOptions?: Option[];
  options?: Option[];

  delay?: number;

  onSearch?: (value: string) => Promise<Option[]>;

  loadingIndicator?: React.ReactNode;
  emptyIndicator?: React.ReactNode;

  maxSelected?: number;
  onMaxSelected?: (count: number) => void;

  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;

  groupBy?: string;

  className?: string;
  badgeClassName?: string;

  selectFirstItem?: boolean;
  creatable?: boolean;
  triggerSearchOnFocus?: boolean;

  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;

  inputProps?: React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Input
  >;

  hideClearAllButton?: boolean;
};

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const [open, setOpen] = React.useState(false);
    const mouseOn = React.useRef(false);

    const [isLoading, setIsLoading] = React.useState(false);

    const [selected, setSelected] = React.useState<Option[]>(
      value || []
    );

    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );

    const [inputValue, setInputValue] = React.useState("");

    const debouncedSearchTerm = useDebounce(
      inputValue,
      delay || 500
    );

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current,
        focus: () => inputRef.current?.focus(),
      }),
      [selected]
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter(
          (s) => s.value !== option.value
        );

        setSelected(newOptions);

        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;

        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              const lastSelectOption =
                selected[selected.length - 1];

              if (!lastSelectOption.fixed) {
                handleUnselect(lastSelectOption);
              }
            }
          }

          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      if (!arrayOptions || onSearch) {
        return;
      }

      const newOption = transToGroupOption(
        arrayOptions || [],
        groupBy
      );

      if (
        JSON.stringify(newOption) !==
        JSON.stringify(options)
      ) {
        setOptions(newOption);
      }
    }, [
      arrayDefaultOptions,
      arrayOptions,
      groupBy,
      onSearch,
      options,
    ]);

    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);

        const res = await onSearch?.(debouncedSearchTerm);

        setOptions(
          transToGroupOption(res || [], groupBy)
        );

        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
    }, [
      debouncedSearchTerm,
      groupBy,
      open,
      triggerSearchOnFocus,
      onSearch,
    ]);

    const CreatableItem = () => {
      if (!creatable) return undefined;

      if (
        isOptionsExist(options, [
          {
            value: inputValue,
            label: inputValue,
          },
        ]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }

            setInputValue("");

            const newOptions = [
              ...selected,
              { value, label: value },
            ];

            setSelected(newOptions);

            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      if (
        onSearch &&
        debouncedSearchTerm.length > 0 &&
        !isLoading
      ) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      if (
        onSearch &&
        !creatable &&
        Object.keys(options).length === 0
      ) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [
      creatable,
      emptyIndicator,
      onSearch,
      options,
    ]);

    const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value
            .toLowerCase()
            .includes(search.toLowerCase())
            ? 1
            : -1;
        };
      }

      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <Command
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className
        )}
        shouldFilter={
          commandProps?.shouldFilter !== undefined
            ? commandProps.shouldFilter
            : !onSearch
        }
        filter={commandFilter()}
      >
        <div
          className={cn(
            "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            {
              "px-3 py-2": selected.length !== 0,
              "cursor-text":
                !disabled && selected.length !== 0,
            },
            className
          )}
          onClick={() => {
            if (disabled) return;

            inputRef.current?.focus();
          }}
        >
          <div className="flex flex-wrap gap-3">
            {selected.map((option) => {
              return (
                <Badge
                  key={option.value}
                  className={cn(
                    "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground bg-purple-500 p-2",
                    "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                    badgeClassName
                  )}
                  data-fixed={option.fixed}
                  data-disabled={disabled || undefined}
                >
                  {option.label}

                  <button
                    className={cn(
                      "ml-1 rounded-full text-white outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      (disabled || option.fixed) && "hidden"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() =>
                      handleUnselect(option)
                    }
                  >
                    <X className="h-4 w-4 text-white hover:text-purple-500" />
                  </button>
                </Badge>
              );
            })}

            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);

                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (mouseOn.current === false) {
                  setOpen(false);
                }

                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);

                triggerSearchOnFocus &&
                  onSearch?.(debouncedSearchTerm);

                inputProps?.onFocus?.(event);
              }}
              placeholder={
                hidePlaceholderWhenSelected &&
                selected.length !== 0
                  ? ""
                  : placeholder
              }
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                {
                  "w-full":
                    hidePlaceholderWhenSelected,
                  "px-3 py-2":
                    selected.length === 0,
                  "ml-1":
                    selected.length !== 0,
                },
                inputProps?.className
              )}
            />

            <button
              type="button"
              onClick={() =>
                setSelected(
                  selected.filter((s) => s.fixed)
                )
              }
              className={cn(
                (hideClearAllButton ||
                  disabled ||
                  selected.length < 1 ||
                  selected.filter((s) => s.fixed)
                    .length === selected.length) &&
                  "hidden"
              )}
            >
              <X />
            </button>
          </div>
        </div>

        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
              onMouseLeave={() => {
                mouseOn.current = false;
              }}
              onMouseEnter={() => {
                mouseOn.current = true;
              }}
              onMouseUp={() => {
                inputRef.current?.focus();
              }}
            >
              {isLoading ? (
                <>{loadingIndicator}</>
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}

                  {!selectFirstItem && (
                    <CommandItem
                      value="-"
                      className="hidden"
                    />
                  )}

                  {Object.entries(selectables).map(
                    ([key, dropdowns]) => (
                      <CommandGroup
                        key={key}
                        heading={key}
                        className="h-full overflow-auto"
                      >
                        <>
                          {dropdowns.map((option) => {
                            return (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                disabled={
                                  option.disable
                                }
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onSelect={() => {
                                  if (
                                    selected.length >=
                                    maxSelected
                                  ) {
                                    onMaxSelected?.(
                                      selected.length
                                    );

                                    return;
                                  }

                                  setInputValue("");

                                  const newOptions = [
                                    ...selected,
                                    option,
                                  ];

                                  setSelected(
                                    newOptions
                                  );

                                  onChange?.(
                                    newOptions
                                  );
                                }}
                                className={cn(
                                  "cursor-pointer",
                                  option.disable &&
                                    "cursor-default text-muted-foreground"
                                )}
                              >
                                {option.label}
                              </CommandItem>
                            );
                          })}
                        </>
                      </CommandGroup>
                    )
                  )}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";

export default MultipleSelector;

export function useDebounce<T>(
  value: T,
  delay: number
): T {
  const [debouncedValue, setDebouncedValue] =
    React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay || 500
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(
  options: Option[],
  groupBy?: string
): GroupOption {
  if (options.length === 0) {
    return {};
  }

  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};

  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";

    if (!groupOption[key]) {
      groupOption[key] = [];
    }

    groupOption[key].push(option);
  });

  return groupOption;
}

function removePickedOption(
  groupOption: GroupOption,
  picked: Option[]
): GroupOption {
  const cloneOption: GroupOption = JSON.parse(
    JSON.stringify(groupOption)
  );

  for (const [key, value] of Object.entries(
    cloneOption
  )) {
    cloneOption[key] = value.filter(
      (val) =>
        !picked.find(
          (p) => p.value === val.value
        )
    );
  }

  return cloneOption;
}

function isOptionsExist(
  groupOption: GroupOption,
  targetOption: Option[]
): boolean {
  for (const [, value] of Object.entries(
    groupOption
  )) {
    if (
      value.some((option) =>
        targetOption.find(
          (p) => p.value === option.value
        )
      )
    ) {
      return true;
    }
  }

  return false;
}