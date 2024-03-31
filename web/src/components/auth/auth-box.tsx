import { FC, FormEvent, ReactNode, useCallback, useState } from "react";
import { Alert, Anchor, Button, Card } from "@mantine/core";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconArrowRight, IconBrandGoogleFilled, IconExclamationCircle } from "@tabler/icons-react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { Header } from "@/components/header";
import { Hr } from "@/components/hr";
import { ServerError, useOAuthLoginMutation } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";
import { app } from "@/firebase";
import { OAuthRegister } from "@/components/auth/oauth-register";

import classes from "./auth-box.module.css";

export interface AuthBoxProps {
  variant?: "login" | "register";
  children?: ReactNode;
  loading?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onReset?: (event: FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export const AuthBox: FC<AuthBoxProps> = ({
  variant = "login",
  loading,
  children,
  onSubmit,
  onReset,
  error,
}) => {
  const params = useSearchParams();
  const [needsOAuthRegister, setNeedsOAuthRegister] = useState<{
    name: string;
    email: string;
    token: string;
  } | null>(null);

  const { mutate: oauthLoginMutate } = useOAuthLoginMutation();
  const auth = useAuth();

  const onGoogleClick = useCallback(() => {
    const firebaseAuth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(firebaseAuth, provider)
      .then((result) => result.user.getIdToken())
      .then((token) => {
        oauthLoginMutate(
          { token },
          {
            onSuccess: (data) => {
              auth.login(data.token);
            },
            onError: (error) => {
              if (error instanceof ServerError && error.status === 404) {
                const user = firebaseAuth.currentUser;
                if (user) {
                  setNeedsOAuthRegister({
                    name: user.displayName ?? "",
                    email: user.email ?? "",
                    token,
                  });
                }
              }
            },
          },
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, [auth, oauthLoginMutate]);

  if (needsOAuthRegister) {
    return (
      <OAuthRegister
        name={needsOAuthRegister.name}
        email={needsOAuthRegister.email}
        token={needsOAuthRegister.token}
      />
    );
  }

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder className={classes.container}>
      <Header>{needsOAuthRegister || variant === "register" ? "Register" : "Login"}</Header>
      <form className={classes.sectionContainer} onSubmit={onSubmit} onReset={onReset}>
        <div className={classes.inputContainer}>{children}</div>
        {error ? (
          <Alert p="0.5rem" icon={<IconExclamationCircle />} color="red" title={error}></Alert>
        ) : null}
        <Button type="submit" variant="filled" loading={loading}>
          {variant === "register" ? "REGISTER" : "LOGIN"}
        </Button>
        {variant === "login" ? (
          <Anchor
            component={Link}
            c="violet"
            href={`/register${params.size ? "?" + params.toString() : ""}`}
            replace
            className={classes.register}
          >
            Create an account <IconArrowRight size="1.25rem" />
          </Anchor>
        ) : (
          <Anchor
            component={Link}
            c="violet"
            href={`/login${params.size ? "?" + params.toString() : ""}`}
            replace
            className={classes.register}
          >
            Already have an account?
          </Anchor>
        )}
        <Hr />
        <Button
          variant="outline"
          color="black"
          leftSection={<IconBrandGoogleFilled />}
          classNames={{ root: classes.googleButton, inner: classes.googleButtonInner }}
          onClick={onGoogleClick}
        >
          Continue with Google
        </Button>
      </form>
    </Card>
  );
};
