"use client";

import Link from "next/link";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight, faCircleCheck, faCircleXmark, faComments, faFileInvoiceDollar, faInbox, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdminMessages } from "@/components/(admin)/shared/admin-messages-provider";
import type { AdminDashboardPipelineStage } from "@/lib/content/admin";

const stageIcons: Record<AdminDashboardPipelineStage["id"], IconDefinition> = {
  new: faInbox,
  contacted: faPhone,
  talking: faComments,
  quoted: faFileInvoiceDollar,
  won: faCircleCheck,
  lost: faCircleXmark,
};

export function PipelinePanel({ stages }: { stages: AdminDashboardPipelineStage[] }) {
  const { messages } = useAdminMessages();

  return (
    <section className="panel pipeline-panel" aria-labelledby="dashboard-pipeline-title">
      <div className="panel-heading">
        <h2 id="dashboard-pipeline-title">Suivi commercial</h2>
        <Link className="panel-link" href="/admin/messages">
          <span>Voir les messages</span>
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </Link>
      </div>
      <ul className="pipeline-grid">
        {stages.map((stage) => (
          <li className={`pipeline-stage pipeline-${stage.tone}`} key={stage.id}>
            <div className="pipeline-stage-topline">
              <span className="pipeline-stage-icon" aria-hidden="true">
                <FontAwesomeIcon icon={stageIcons[stage.id]} />
              </span>
              <span className="pipeline-value">{messages.filter((message) => message.status === stage.id).length}</span>
            </div>
            <span className="pipeline-label">{stage.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
