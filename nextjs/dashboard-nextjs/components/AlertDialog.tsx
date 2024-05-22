import React from 'react';
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export default function Alert_Dialog({
  children,
  title,
  message,
}: {
  children: React.ReactNode;
  title: string;
  message: string;
}) {
  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {children}
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
}
