"use client";

import { FC, useCallback } from "react";
import { Button, Grid, GridCol, InputError, Rating, Textarea } from "@mantine/core";
import { useFormik } from "formik";
import { Alert } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

import { useAddReviewMutation } from "@/api/api";
import { schema } from "@shared/validation/review";

import classes from "./review-form.module.css";

export interface ReviewFormProps {
  listId: number;
}

export const ReviewForm: FC<ReviewFormProps> = ({ listId }) => {
  const { mutate, isSuccess } = useAddReviewMutation();

  const formik = useFormik({
    initialValues: { content: "", rating: 0 },
    validationSchema: schema,
    onSubmit(values) {
      mutate({ list_id: listId, stars: values.rating, text_content: values.content });
    },
  });

  const onRatingChange = useCallback(
    (value: number) => {
      formik.setFieldValue("rating", value, true);
    },
    [formik],
  );

  if (isSuccess) {
    return (
      <Alert color="teal" title="Review created" icon={<IconCircleCheck />} maw="24rem"></Alert>
    );
  }

  return (
    <Grid className={classes.container}>
      <GridCol span={{ base: 12, md: 8, lg: 6 }}>
        <form
          onSubmit={formik.handleSubmit}
          onReset={formik.handleReset}
          className={classes.container}
        >
          <div>
            <Textarea
              placeholder="Add a review"
              variant="filled"
              rows={5}
              name="content"
              id="review-content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.content && formik.errors.content}
            />
          </div>
          <div className={classes.createRowContainer}>
            <div className={classes.ratingContainer}>
              <Rating
                count={5}
                size="xl"
                name="rating"
                id="review-rating"
                value={formik.values.rating}
                onBlur={formik.handleBlur}
                onChange={onRatingChange}
              />
              {formik.touched.rating && formik.errors.rating ? (
                <InputError>{formik.errors.rating}</InputError>
              ) : null}
            </div>
            <Button variant="filled" type="submit" className={classes.createButton}>
              CREATE
            </Button>
          </div>
        </form>
      </GridCol>
    </Grid>
  );
};
