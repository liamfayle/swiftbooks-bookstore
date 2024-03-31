import { FC, useCallback, useEffect, useState } from "react";
import { Card, Chip, Rating, Tooltip } from "@mantine/core";
import humanizeDuration from "humanize-duration";
import { DateTime } from "luxon";
import { IconEyeOff } from "@tabler/icons-react";

import { ApiReview } from "@/api/types";
import { useAuth } from "@/components/auth/auth-context";
import { useCurrentUser, useToggleReviewMutation } from "@/api/api";

import classes from "./review.module.css";

interface DateProps {
  addedAt: string;
}

const Date: FC<DateProps> = ({ addedAt }) => {
  const [label, setLabel] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    let timeout: number;

    const updateDate = () => {
      const dateTime = DateTime.fromISO(addedAt);

      if (!dateTime.isValid) {
        return -1;
      }

      const humanizer = humanizeDuration.humanizer({
        units: ["y", "d", "h", "m", "s"],
        largest: 1,
        round: true,
      });

      const diff = Math.abs(dateTime.diffNow("milliseconds").milliseconds);

      setContent(humanizer(diff) + " ago");
      setLabel(dateTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS));

      return diff;
    };

    const update = () => {
      const diff = updateDate();

      if (diff !== -1 && diff < 60 * 1000) {
        timeout = setTimeout(update, 1000) as unknown as number;
      }
    };

    update();

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [addedAt]);

  return (
    <Tooltip color="gray" position="bottom" inline label={label} className={classes.tooltip}>
      <span>{content}</span>
    </Tooltip>
  );
};

export interface ReviewProps {
  data: ApiReview;
}

export const Review: FC<ReviewProps> = ({ data }) => {
  const auth = useAuth();
  const { data: currentUser, isSuccess } = useCurrentUser(auth.status.isAuthenticated);
  const { mutate } = useToggleReviewMutation();

  const canHide =
    auth.status.isAuthenticated &&
    isSuccess &&
    (currentUser.status === "manager" || currentUser.status === "admin");

  const onHideClick = useCallback(() => {
    mutate(data.id);
  }, [mutate, data.id]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <div className={classes.headerContainer}>
        <div className={classes.creator}>{data.username}</div>
        <Rating value={data.stars} count={5} readOnly id="review-rating-view" />
        <div className={classes.spacer}></div>
        <div className={classes.date}>
          <Date addedAt={data.added_at} />
        </div>
      </div>
      <div className={classes.content}>{data.content}</div>
      {canHide ? (
        <div className={classes.hideContainer}>
          <Chip
            icon={<IconEyeOff />}
            checked={data.hidden}
            color="red"
            variant="light"
            radius="sm"
            onChange={onHideClick}
            classNames={{ label: classes.hide }}
          >
            {data.hidden ? "HIDDEN" : "VISIBLE"}
          </Chip>
        </div>
      ) : null}
    </Card>
  );
};
