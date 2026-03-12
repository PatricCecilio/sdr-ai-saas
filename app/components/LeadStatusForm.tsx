import { updateLeadStatus } from "../actions";

type LeadStatusFormProps = {
  leadId: string;
  currentStatus: string;
};

export default function LeadStatusForm({
  leadId,
  currentStatus,
}: LeadStatusFormProps) {
  return (
    <form action={updateLeadStatus} className="mt-3 flex items-center gap-2">
      <input type="hidden" name="leadId" value={leadId} />

      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
      >
        <option value="NOVO">NOVO</option>
        <option value="CONTATO_FEITO">CONTATO_FEITO</option>
        <option value="NEGOCIANDO">NEGOCIANDO</option>
        <option value="FECHADO">FECHADO</option>
      </select>

      <button
        type="submit"
        className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90"
      >
        Salvar status
      </button>
    </form>
  );
}