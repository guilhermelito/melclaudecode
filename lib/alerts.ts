import {
  CONTRACT_WARNING_DAYS,
  INSURANCE_WARNING_DAYS,
  OBLIGATION_WARNING_DAYS,
  getDateUrgency,
  type Urgency,
} from "@/lib/urgency";
import type { InsurancePolicy, LeaseContract, Property, RecurringObligation } from "@/lib/types";

export type Alert = {
  id: string;
  severity: "vencido" | "atencao";
  category: "Contrato" | "Reajuste" | "Seguro" | "Obrigação";
  propertyId: string;
  propertyNickname: string;
  description: string;
  date: string | null;
};

const severityRank: Record<"vencido" | "atencao", number> = { vencido: 0, atencao: 1 };

function worseUrgency(a: Urgency | null, b: Urgency | null): Urgency | null {
  const rank: Record<Urgency, number> = { vencido: 0, atencao: 1, ok: 2 };
  if (!a) return b;
  if (!b) return a;
  return rank[a] <= rank[b] ? a : b;
}

export function buildAlerts({
  properties,
  contracts,
  policies,
  obligations,
}: {
  properties: Property[];
  contracts: LeaseContract[];
  policies: InsurancePolicy[];
  obligations: RecurringObligation[];
}): Alert[] {
  const propertyName = new Map(properties.map((p) => [p.id, p.nickname]));
  const alerts: Alert[] = [];

  for (const contract of contracts) {
    if (!contract.is_active) continue;
    const nickname = propertyName.get(contract.property_id) ?? "—";

    const endUrgency = getDateUrgency(contract.contract_end_date, CONTRACT_WARNING_DAYS);
    if (endUrgency === "vencido" || endUrgency === "atencao") {
      alerts.push({
        id: `contract-end-${contract.id}`,
        severity: endUrgency,
        category: "Contrato",
        propertyId: contract.property_id,
        propertyNickname: nickname,
        description: `Contrato com ${contract.tenant_name} ${
          endUrgency === "vencido" ? "venceu" : "vence em breve"
        }`,
        date: contract.contract_end_date,
      });
    }

    const readjustUrgency = getDateUrgency(
      contract.next_readjustment_date,
      CONTRACT_WARNING_DAYS
    );
    if (readjustUrgency === "vencido" || readjustUrgency === "atencao") {
      alerts.push({
        id: `contract-readjust-${contract.id}`,
        severity: readjustUrgency,
        category: "Reajuste",
        propertyId: contract.property_id,
        propertyNickname: nickname,
        description: `Reajuste do contrato com ${contract.tenant_name} ${
          readjustUrgency === "vencido" ? "atrasado" : "próximo"
        }`,
        date: contract.next_readjustment_date,
      });
    }
  }

  for (const policy of policies) {
    if (!policy.is_active) continue;
    const nickname = propertyName.get(policy.property_id) ?? "—";
    const urgency = getDateUrgency(policy.coverage_end_date, INSURANCE_WARNING_DAYS);
    if (urgency === "vencido" || urgency === "atencao") {
      alerts.push({
        id: `insurance-${policy.id}`,
        severity: urgency,
        category: "Seguro",
        propertyId: policy.property_id,
        propertyNickname: nickname,
        description: `Seguro ${policy.insurer_name} ${
          urgency === "vencido" ? "venceu" : "vence em breve"
        }`,
        date: policy.coverage_end_date,
      });
    }
  }

  // Imóvel sem nenhum seguro ativo e com vigência válida: o problema original
  // que motivou este app (seguro vencido sem ninguém perceber).
  const today = new Date().toISOString().slice(0, 10);
  const propertiesWithValidInsurance = new Set(
    policies
      .filter((p) => p.is_active && (!p.coverage_end_date || p.coverage_end_date >= today))
      .map((p) => p.property_id)
  );
  for (const property of properties) {
    if (!propertiesWithValidInsurance.has(property.id)) {
      alerts.push({
        id: `no-insurance-${property.id}`,
        severity: "vencido",
        category: "Seguro",
        propertyId: property.id,
        propertyNickname: property.nickname,
        description: "Sem seguro válido cadastrado",
        date: null,
      });
    }
  }

  for (const obligation of obligations) {
    const nickname = propertyName.get(obligation.property_id) ?? "—";
    const dateUrgency = getDateUrgency(obligation.next_due_date, OBLIGATION_WARNING_DAYS);
    const statusUrgency: Urgency | null =
      obligation.current_status === "Vencido"
        ? "vencido"
        : obligation.current_status === "Pendente" ||
            obligation.current_status === "Aguardando reembolso"
          ? "atencao"
          : null;

    const urgency = worseUrgency(dateUrgency, statusUrgency);
    if (urgency === "vencido" || urgency === "atencao") {
      alerts.push({
        id: `obligation-${obligation.id}`,
        severity: urgency,
        category: "Obrigação",
        propertyId: obligation.property_id,
        propertyNickname: nickname,
        description: `${obligation.obligation_type} — ${obligation.current_status.toLowerCase()}`,
        date: obligation.next_due_date,
      });
    }
  }

  return alerts.sort((a, b) => {
    if (a.severity !== b.severity) return severityRank[a.severity] - severityRank[b.severity];
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });
}
