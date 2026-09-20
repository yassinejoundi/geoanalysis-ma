import type { AdminExpertise, AdminSubService } from "@/lib/content/admin";
import { StatusBadge } from "@/components/(admin)/shared/status-badge";

type ExpertiseRowProps = {
  expertise: AdminExpertise;
  expanded: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggleExpanded: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublication: () => void;
  onMove: (direction: "up" | "down") => void;
  onAddSubService: () => void;
  onEditSubService: (subService: AdminSubService) => void;
  onDeleteSubService: (subService: AdminSubService) => void;
  onToggleSubServicePublication: (subService: AdminSubService) => void;
  onMoveSubService: (
    subService: AdminSubService,
    direction: "up" | "down",
  ) => void;
};

export function ExpertiseRow({
  expertise,
  expanded,
  canMoveUp,
  canMoveDown,
  onToggleExpanded,
  onEdit,
  onDelete,
  onTogglePublication,
  onMove,
  onAddSubService,
  onEditSubService,
  onDeleteSubService,
  onToggleSubServicePublication,
  onMoveSubService,
}: ExpertiseRowProps) {
  const listId = "sub-services-" + expertise.id;

  return (
    <article className="expertise-card">
      <div className="expertise-card-header">
        <div className="expertise-card-copy">
          <div className="expertise-card-title">
            <h2>{expertise.name.fr}</h2>
            <StatusBadge status={expertise.state} />
          </div>
          <p className="expertise-card-english">{expertise.name.en}</p>
          <p className="expertise-card-summary">{expertise.short.fr}</p>
          <p className="expertise-card-slug">/expertises/{expertise.slug}</p>
        </div>

        <div className="admin-action-group">
          <button
            className="admin-action"
            type="button"
            aria-label={
              (expanded
                ? "Masquer les sous-services de "
                : "Afficher les sous-services de ") + expertise.name.fr
            }
            aria-expanded={expanded}
            aria-controls={listId}
            onClick={onToggleExpanded}>
            {expanded
              ? "Masquer les sous-services"
              : "Afficher les sous-services"}
          </button>
          <button
            className="admin-action"
            type="button"
            aria-label={
              "Déplacer l’expertise « " + expertise.name.fr + " » vers le haut"
            }
            onClick={() => onMove("up")}
            disabled={!canMoveUp}>
            Monter
          </button>
          <button
            className="admin-action"
            type="button"
            aria-label={
              "Déplacer l’expertise « " + expertise.name.fr + " » vers le bas"
            }
            onClick={() => onMove("down")}
            disabled={!canMoveDown}>
            Descendre
          </button>
          <button
            className="admin-action"
            type="button"
            aria-label={
              (expertise.state === "published"
                ? "Dépublier l’expertise « "
                : "Publier l’expertise « ") +
              expertise.name.fr +
              " »"
            }
            onClick={onTogglePublication}>
            {expertise.state === "published" ? "Dépublier" : "Publier"}
          </button>
          <button
            className="admin-action"
            type="button"
            aria-label={"Modifier l’expertise « " + expertise.name.fr + " »"}
            onClick={onEdit}>
            Modifier
          </button>
          <button
            className="admin-action admin-action-danger"
            type="button"
            aria-label={"Supprimer l’expertise « " + expertise.name.fr + " »"}
            onClick={onDelete}>
            Supprimer
          </button>
        </div>
      </div>

      <div className="expertise-subservices" id={listId} hidden={!expanded}>
        {expertise.subServices.length === 0 ? (
          <p className="expertise-empty-subservices">
            Aucun sous-service pour le moment.
          </p>
        ) : (
          <ul className="expertise-subservice-list">
            {expertise.subServices.map((subService, index) => (
              <li className="expertise-subservice-row" key={subService.id}>
                <div className="expertise-subservice-copy">
                  <div className="expertise-subservice-title">
                    <h3>{subService.name.fr}</h3>
                    <StatusBadge status={subService.state} />
                  </div>
                  <p className="expertise-card-english">{subService.name.en}</p>
                  <p className="expertise-card-summary">
                    {subService.short.fr}
                  </p>
                </div>
                <div className="admin-action-group">
                  <button
                    className="admin-action"
                    type="button"
                    aria-label={
                      "Déplacer « " + subService.name.fr + " » vers le haut"
                    }
                    onClick={() => onMoveSubService(subService, "up")}
                    disabled={index === 0}>
                    Monter
                  </button>
                  <button
                    className="admin-action"
                    type="button"
                    aria-label={
                      "Déplacer « " + subService.name.fr + " » vers le bas"
                    }
                    onClick={() => onMoveSubService(subService, "down")}
                    disabled={index === expertise.subServices.length - 1}>
                    Descendre
                  </button>
                  <button
                    className="admin-action"
                    type="button"
                    aria-label={
                      (subService.state === "published" ? "Dépublier « " : "Publier « ") +
                      subService.name.fr +
                      " »"
                    }
                    onClick={() => onToggleSubServicePublication(subService)}>
                    {subService.state === "published" ? "Dépublier" : "Publier"}
                  </button>
                  <button
                    className="admin-action"
                    type="button"
                    aria-label={"Modifier « " + subService.name.fr + " »"}
                    onClick={() => onEditSubService(subService)}>
                    Modifier
                  </button>
                  <button
                    className="admin-action admin-action-danger"
                    type="button"
                    aria-label={"Supprimer « " + subService.name.fr + " »"}
                    onClick={() => onDeleteSubService(subService)}>
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="admin-action admin-action-primary"
          type="button"
          aria-label={"Ajouter un sous-service à " + expertise.name.fr}
          onClick={onAddSubService}>
          Ajouter un sous-service
        </button>
      </div>
    </article>
  );
}
