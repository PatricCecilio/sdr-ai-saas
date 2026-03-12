"use client";

type DeleteLeadButtonProps = {
  label?: string;
};

export default function DeleteLeadButton({
  label = "Excluir",
}: DeleteLeadButtonProps) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(
          "Tem certeza que deseja excluir este lead?"
        );

        if (!confirmed) {
          e.preventDefault();
        }
      }}
      className="rounded-xl bg-red-600 px-4 py-2 text-white hover:opacity-90"
    >
      {label}
    </button>
  );
}