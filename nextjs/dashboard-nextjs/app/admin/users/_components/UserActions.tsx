'use client';

import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteUser } from '@/app/admin/_actions/users';

export function DeleteUserToggleAction({
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
          await deleteUser(id);
          router.refresh();
        });
      }}
    >
      Delete
    </AlertDialogAction>
  );
}
