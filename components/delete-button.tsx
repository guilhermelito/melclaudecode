"use client";

export function DeleteButton({
  action,
  confirmMessage,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-sm text-red-600 hover:underline">
        Remover
      </button>
    </form>
  );
}
