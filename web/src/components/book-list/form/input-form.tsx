import { FC } from "react";
import { Button, Checkbox, Textarea, TextInput } from "@mantine/core";
import { useFormik } from "formik";

import { ApiBookList } from "@/api/types";
import { schema } from "@shared/validation/book-list";

import classes from "./input-form.module.css";

const initialValues = { name: "", description: "", isPublic: false };

export type Values = typeof initialValues;

export interface InputFormProps {
  onSubmit?: (values: Values) => void;
  loading?: boolean;
  data?: ApiBookList;
}

export const InputForm: FC<InputFormProps> = ({ onSubmit, loading, data }) => {
  const isUpdating = data != null;

  const formik = useFormik({
    initialValues: isUpdating
      ? {
          name: data.list_name,
          description: data.description ?? "",
          isPublic: data.is_public,
        }
      : initialValues,
    validationSchema: schema,
    onSubmit(values) {
      onSubmit?.(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className={classes.container}>
      <div>
        <TextInput
          placeholder="Book list name *"
          variant="filled"
          name="name"
          id="book-list-name"
          size="md"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />
      </div>
      <div>
        <Textarea
          placeholder="Book list description"
          variant="filled"
          rows={5}
          name="description"
          id="book-list-description"
          size="md"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />
      </div>
      <div className={classes.createRowContainer}>
        <div className={classes.checkboxContainer}>
          <Checkbox
            label="Public"
            labelPosition="left"
            name="isPublic"
            id="book-list-is-public"
            size="md"
            classNames={{ label: classes.createButtonLabel }}
            checked={formik.values.isPublic}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.isPublic && formik.errors.isPublic}
          />
        </div>
        <div className={classes.createButtonContainer}>
          <Button variant="filled" type="submit" loading={loading}>
            {isUpdating ? "UPDATE" : "CREATE"}
          </Button>
        </div>
      </div>
    </form>
  );
};
