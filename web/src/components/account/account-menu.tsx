import { FC, useCallback, useState } from "react";
import {
  Popover,
  ActionIcon,
  PopoverTarget,
  PopoverDropdown,
  Button,
  CloseButton,
  ActionIconProps,
  Title,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

import { Hr } from "@/components/hr";
import { useAuth } from "@/components/auth/auth-context";
import { client, useCurrentUser } from "@/api/api";

import classes from "./account-menu.module.css";

/**
 * `AccountMenu` represents a user account menu with login/logout functionality.
 */
export const AccountMenu: FC<ActionIconProps> = (props) => {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const { data: user } = useCurrentUser(auth.status.isAuthenticated);

  const onLogout = useCallback(() => {
    setOpened(false);
    // Delay logout to let the popover close
    setTimeout(async () => {
      auth.logout();
      await client.resetQueries();
    }, 150);
  }, [auth]);

  const onLogin = useCallback(() => {
    setOpened(false);
    router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  return (
    <Popover
      id="account-popover"
      shadow="sm"
      radius="md"
      position="bottom-end"
      trapFocus
      returnFocus
      opened={opened}
      onChange={setOpened}
    >
      <PopoverTarget>
        <ActionIcon
          size="2.5rem"
          variant="subtle"
          color="black"
          onClick={() => setOpened(!opened)}
          {...props}
        >
          <IconUser size="2.5rem" />
        </ActionIcon>
      </PopoverTarget>
      <PopoverDropdown className={classes.dropdown}>
        <div className={classes.container}>
          {auth.status.isAuthenticated ? (
            <>
              <div>
                <div className={classes.nameRow}>
                  {user ? (
                    <Title order={3} className={classes.name}>
                      {user.name}
                    </Title>
                  ) : null}
                  <CloseButton onClick={() => setOpened(false)} />
                </div>
                {user ? <div className={classes.email}>{user.username}</div> : null}
                {user ? <div className={classes.email}>{user.email}</div> : null}
              </div>
              <Hr />
              <Button variant="light" color="red" data-autofocus onClick={onLogout}>
                LOGOUT
              </Button>
            </>
          ) : (
            <Button variant="light" color="violet" data-autofocus onClick={onLogin}>
              LOGIN
            </Button>
          )}
        </div>
      </PopoverDropdown>
    </Popover>
  );
};
