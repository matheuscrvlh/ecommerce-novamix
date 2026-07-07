import StatCard from '../../components/StatCard';
import Skeleton from '../../components/Skeleton';
import { CheckCircleIcon, UsersIcon } from '../../components/icons';

type Pedido = {
  id: number;
  usuario_id: number | null;
  bipado_em: string | null;
};

type DashboardStatsSectionProps = {
  pedidos: Pedido[];
  carregando: boolean;
};

function isHoje(data: string | null) {
  if (!data) return false;
  return new Date(data).toDateString() === new Date().toDateString();
}

export default function DashboardStatsSection({
  pedidos,
  carregando,
}: DashboardStatsSectionProps) {
  const bipadosHoje = pedidos.filter((pedido) => isHoje(pedido.bipado_em));
  const operadoresAtivosHoje = new Set(
    bipadosHoje.map((pedido) => pedido.usuario_id),
  ).size;

  if (carregando && pedidos.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-gray-dark uppercase">
          Pedidos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1].map((indice) => (
            <div
              key={indice}
              className="rounded-lg bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-8 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold tracking-wide text-gray-dark uppercase">
        Pedidos
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Bipados"
          value={bipadosHoje.length}
          color="green"
          icon={<CheckCircleIcon className="h-5 w-5" />}
        />
        <StatCard
          label="Operadores ativos hoje"
          value={operadoresAtivosHoje}
          color="teal"
          icon={<UsersIcon className="h-5 w-5" />}
        />
      </div>
    </section>
  );
}
