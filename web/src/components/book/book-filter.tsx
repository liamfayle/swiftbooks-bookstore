"use client";

import { FC, useCallback } from "react";
import { Button, Grid, GridCol, Select, TextInput } from "@mantine/core";
import { useFormik } from "formik";

import { ApiSearchBookInput } from "@/api/types";
import { subjects } from "./subjects";

import classes from "./book-filter.module.css";

export interface BookFilterProps {
  loading?: boolean;
  onSubmit?: (input: ApiSearchBookInput) => void;
}

export const BookFilter: FC<BookFilterProps> = ({ loading, onSubmit }) => {
  const formik = useFormik({
    initialValues: { title: "", author: "", field: "" },
    onSubmit(values) {
      onSubmit?.(values);
    },
  });

  const onSubjectChange = useCallback(
    (subject: string | null) => {
      formik.setFieldValue("field", subject ?? "");
    },
    [formik],
  );

  return (
    <form className={classes.container} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
      <Grid gutter="1.25rem">
        <GridCol span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
          <TextInput
            placeholder="Title"
            name="title"
            id="book-title"
            variant="filled"
            size="md"
            className={classes.input}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
          <TextInput
            placeholder="Author"
            name="author"
            id="book-author"
            variant="filled"
            size="md"
            className={classes.input}
            value={formik.values.author}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </GridCol>
        <GridCol span={{ base: 12, sm: 4, lg: 3 }}>
          <Select
            placeholder="Subject"
            variant="filled"
            name="field"
            id="book-field"
            size="md"
            data={subjects}
            searchable
            clearable
            value={formik.values.field}
            onChange={onSubjectChange}
            onBlur={formik.handleBlur}
          />
        </GridCol>
        <GridCol span={{ base: 12, lg: 3 }}>
          <Button variant="filled" size="md" type="submit" loading={loading}>
            FILTER
          </Button>
        </GridCol>
      </Grid>
    </form>
  );
};
