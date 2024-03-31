import { FC, HTMLAttributes, MouseEvent, useCallback } from "react";
import { Button, ButtonProps } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

import { useAddCartBookMutation, useCart } from "@/api/api";
import { useAuth } from "@/components/auth/auth-context";

export const AddToCartButton: FC<
  HTMLAttributes<HTMLButtonElement> & ButtonProps & { id: string }
> = ({ id, onClick, ...rest }) => {
  const auth = useAuth();
  const { data: cartItems, isSuccess } = useCart(auth.status.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();

  const addCartBookMutation = useAddCartBookMutation();

  const onAddToCart = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (!auth.status.isAuthenticated) {
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!isSuccess) {
        return;
      }

      const cartItem = cartItems.find((item) => item.book_id === id);

      addCartBookMutation.mutate({
        book_id: id,
        quantity: cartItem ? Math.min(10, cartItem.quantity + 1) : 1,
      });

      onClick?.(event);
    },
    [
      addCartBookMutation,
      auth.status.isAuthenticated,
      cartItems,
      id,
      isSuccess,
      onClick,
      pathname,
      router,
    ],
  );

  return (
    <Button variant="light" color="violet" size="xs" onClick={onAddToCart} {...rest}>
      ADD TO CART
    </Button>
  );
};
