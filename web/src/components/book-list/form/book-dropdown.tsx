import { FC, useState } from "react";
import { Combobox, ComboboxOption, Loader, TextInput, useCombobox } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";

import classes from "./book-dropdown.module.css";
import { useBookSearch } from "@/api/api";
import { ApiSearchBookInput } from "@/api/types";

export interface BookDropdownProps {
  excludeIds?: string[];
  onSubmit?: (id: string) => void;
}

export const BookDropdown: FC<BookDropdownProps> = ({ excludeIds = [], onSubmit }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [filters, setFilters] = useState<ApiSearchBookInput>({ title: "", author: "", limit: 10 });
  const [debouncedFilters] = useDebouncedValue(filters, 250, { leading: true });
  const { data: books, isLoading, isFetching, isSuccess } = useBookSearch(debouncedFilters);

  const onQueryChange = (query: string) => {
    setFilters({ ...filters, title: query });
  };

  const empty = isSuccess && books.length === 0;

  const options = isSuccess
    ? books
        .filter(({ id }) => !excludeIds.includes(id))
        .filter(({ title }) => Boolean(title))
        .map(({ id, title, authors }) => (
          <ComboboxOption value={id} key={id}>
            {title}{" "}
            {authors?.length ? <span className={classes.author}> - {authors[0]}</span> : null}
          </ComboboxOption>
        ))
    : [];

  return (
    <div className={classes.container}>
      <Combobox
        onOptionSubmit={(value) => {
          onSubmit?.(value);
          onQueryChange("");
          combobox.closeDropdown();
        }}
        withinPortal={false}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            id="add-book"
            placeholder="Add book"
            rightSection={
              !isLoading && isFetching && combobox.dropdownOpened ? (
                <Loader size={18} />
              ) : (
                <IconChevronDown />
              )
            }
            variant="filled"
            value={filters.title}
            onChange={(event) => {
              const value = event.currentTarget.value;
              onQueryChange(value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            className={classes.dropdown}
            size="md"
          />
        </Combobox.Target>

        <Combobox.Dropdown hidden={books == null}>
          <Combobox.Options id="add-book-options">
            {options}
            {empty && <Combobox.Empty>No results found</Combobox.Empty>}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
};
