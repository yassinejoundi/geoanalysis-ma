import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDown,
  faArrowUp,
  faChevronDown,
  faChevronUp,
  faEye,
  faEyeSlash,
  faFileLines,
  faLayerGroup,
  faLink,
  faPen,
  faPlus,
  faSitemap,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

function ExpertiseAction({
  icon,
  label,
  onClick,
  disabled = false,
  danger = false,
  expanded,
  controls,
}: {
  icon: IconDefinition;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  expanded?: boolean;
  controls?: string;
}) {
  return (
    <button
      className={`expertise-icon-action${danger ? " expertise-icon-action-danger" : ""}`}
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      title={label}
      onClick={onClick}
      disabled={disabled}>
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </button>
  );
}

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
  const subServicesId = `sub-services-${expertise.id}`;
  const subServicesHeadingId = `sub-services-heading-${expertise.id}`;
  const subServiceCount = expertise.subServices.length;
  const disclosureLabel = `${expanded ? "Masquer" : "Afficher"} les sous-services de ${expertise.name.fr}`;

  return (
    <article className="expertise-card">
      <header className="expertise-card-header">
        <div className="expertise-card-intro">
          <span className="expertise-card-icon" aria-hidden="true">
            <FontAwesomeIcon icon={faLayerGroup} />
          </span>
          <div className="expertise-card-copy">
            <div className="expertise-card-title">
              <h2>{expertise.name.fr}</h2>
              <StatusBadge status={expertise.state} />
            </div>
            <p className="expertise-card-english">{expertise.name.en}</p>
            <p className="expertise-card-summary">{expertise.short.fr}</p>
            <div className="expertise-card-metadata">
              <span className="expertise-card-metadata-item">
                <FontAwesomeIcon icon={faLink} aria-hidden="true" />
                <span>/expertises/{expertise.slug}</span>
              </span>
              <span className="expertise-card-metadata-item">
                <FontAwesomeIcon icon={faSitemap} aria-hidden="true" />
                <span>
                  {subServiceCount === 1
                    ? "1 sous-service"
                    : `${subServiceCount.toLocaleString("fr-FR")} sous-services`}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div
          className="expertise-card-actions"
          role="group"
          aria-label={`Actions de l’expertise ${expertise.name.fr}`}>
          <ExpertiseAction
            icon={expanded ? faChevronUp : faChevronDown}
            label={disclosureLabel}
            onClick={onToggleExpanded}
            expanded={expanded}
            controls={subServicesId}
          />
          <ExpertiseAction
            icon={faArrowUp}
            label={`Déplacer l’expertise « ${expertise.name.fr} » vers le haut`}
            onClick={() => onMove("up")}
            disabled={!canMoveUp}
          />
          <ExpertiseAction
            icon={faArrowDown}
            label={`Déplacer l’expertise « ${expertise.name.fr} » vers le bas`}
            onClick={() => onMove("down")}
            disabled={!canMoveDown}
          />
          <ExpertiseAction
            icon={expertise.state === "published" ? faEyeSlash : faEye}
            label={`${expertise.state === "published" ? "Dépublier" : "Publier"} l’expertise « ${expertise.name.fr} »`}
            onClick={onTogglePublication}
          />
          <ExpertiseAction
            icon={faPen}
            label={`Modifier l’expertise « ${expertise.name.fr} »`}
            onClick={onEdit}
          />
          <ExpertiseAction
            icon={faTrash}
            label={`Supprimer l’expertise « ${expertise.name.fr} »`}
            onClick={onDelete}
            danger
          />
        </div>
      </header>

      <section
        className="expertise-subservices"
        id={subServicesId}
        aria-labelledby={subServicesHeadingId}
        hidden={!expanded}>
        <header className="expertise-subservices-header">
          <div>
            <h3 id={subServicesHeadingId}>Sous-services</h3>
            <span className="expertise-subservices-count">
              {subServiceCount === 1
                ? "1 élément"
                : `${subServiceCount.toLocaleString("fr-FR")} éléments`}
            </span>
          </div>
          <button
            className="expertise-secondary-action"
            type="button"
            aria-label={`Ajouter un sous-service à ${expertise.name.fr}`}
            onClick={onAddSubService}>
            <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
            Ajouter un sous-service
          </button>
        </header>

        {subServiceCount === 0 ? (
          <p className="expertise-empty-subservices">
            Aucun sous-service. Ajoutez-en un pour détailler cette expertise.
          </p>
        ) : (
          <ul className="expertise-subservice-list">
            {expertise.subServices.map((subService, index) => (
              <li className="expertise-subservice-row" key={subService.id}>
                <div className="expertise-subservice-intro">
                  <span className="expertise-subservice-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faFileLines} />
                  </span>
                  <div className="expertise-subservice-copy">
                    <div className="expertise-subservice-title">
                      <h4>{subService.name.fr}</h4>
                      <StatusBadge status={subService.state} />
                    </div>
                    <p className="expertise-card-english">{subService.name.en}</p>
                    <p className="expertise-card-summary">{subService.short.fr}</p>
                  </div>
                </div>

                <div
                  className="expertise-subservice-actions"
                  role="group"
                  aria-label={`Actions du sous-service ${subService.name.fr}`}>
                  <ExpertiseAction
                    icon={faArrowUp}
                    label={`Déplacer le sous-service « ${subService.name.fr} » vers le haut`}
                    onClick={() => onMoveSubService(subService, "up")}
                    disabled={index === 0}
                  />
                  <ExpertiseAction
                    icon={faArrowDown}
                    label={`Déplacer le sous-service « ${subService.name.fr} » vers le bas`}
                    onClick={() => onMoveSubService(subService, "down")}
                    disabled={index === subServiceCount - 1}
                  />
                  <ExpertiseAction
                    icon={subService.state === "published" ? faEyeSlash : faEye}
                    label={`${subService.state === "published" ? "Dépublier" : "Publier"} le sous-service « ${subService.name.fr} »`}
                    onClick={() => onToggleSubServicePublication(subService)}
                  />
                  <ExpertiseAction
                    icon={faPen}
                    label={`Modifier le sous-service « ${subService.name.fr} »`}
                    onClick={() => onEditSubService(subService)}
                  />
                  <ExpertiseAction
                    icon={faTrash}
                    label={`Supprimer le sous-service « ${subService.name.fr} »`}
                    onClick={() => onDeleteSubService(subService)}
                    danger
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
