'use client';

import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteOrder } from '../../_actions/orders';

export function DeleteOrderToggleAction({
  id,
  disabled,
}: {
  id: string;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <AlertDialogAction
      className=" bg-destructive hover:bg-destructive"
      onClick={() => {
        startTransition(async () => {
          await deleteOrder(id);
          router.refresh();
        });
      }}
    >
      Delete
    </AlertDialogAction>
  );
}
