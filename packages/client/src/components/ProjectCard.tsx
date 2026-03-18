import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shortenPath } from "../lib/text";
import type { Project } from "../types";
import { ThinkingIndicator } from "./ThinkingIndicator";

interface ProjectCardProps {
  project: Project;
  /** Number of sessions needing approval/input in this project */
  needsAttentionCount: number;
  /** Number of sessions actively thinking (running, no pending input) */
  thinkingCount: number;
  /** Base path prefix for relay mode (e.g., "/remote/my-server") */
  basePath?: string;
  /** Whether the project is archived */
  isArchived?: boolean;
  /** Callback to toggle archive status */
  onToggleArchive?: () => void;
}

/**
 * Format relative time for display
 */
function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Card component for displaying a project in the projects list.
 * Matches visual style of SessionListItem card mode.
 */
export function ProjectCard({
  project,
  needsAttentionCount,
  thinkingCount,
  basePath = "",
  isArchived,
  onToggleArchive,
}: ProjectCardProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNewSession = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`${basePath}/new-session?projectId=${project.id}`);
  };

  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  }, []);

  const handleArchiveClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setMenuOpen(false);
      onToggleArchive?.();
    },
    [onToggleArchive],
  );

  return (
    <li
      className={`project-card${isArchived ? " project-card--archived" : ""}`}
    >
      <Link
        to={`${basePath}/sessions?project=${project.id}`}
        className="project-card__link"
      >
        <div className="project-card__header">
          <strong className="project-card__name">
            {needsAttentionCount > 0 && (
              <span className="project-card__attention-badge">
                {needsAttentionCount}
              </span>
            )}
            {project.name}
          </strong>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-card__new-session"
              onClick={handleNewSession}
              title="New session"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="project-card__menu-container" ref={menuRef}>
              <button
                type="button"
                className="project-card__menu-button"
                onClick={handleMenuToggle}
                title="More options"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
              {menuOpen && (
                <div className="project-card__menu">
                  <button
                    type="button"
                    className="project-card__menu-item"
                    onClick={handleArchiveClick}
                  >
                    {isArchived ? "Unarchive" : "Archive"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="project-card__meta">
          <span className="project-card__path" title={project.path}>
            {shortenPath(project.path)}
          </span>
          <span className="project-card__stats">
            <span className="project-card__sessions">
              {project.sessionCount} session
              {project.sessionCount !== 1 ? "s" : ""}
            </span>
            {thinkingCount > 0 && (
              <span className="project-card__thinking">
                <ThinkingIndicator />
                <span>{thinkingCount}</span>
              </span>
            )}
            {project.lastActivity && (
              <>
                <span className="project-card__separator">·</span>
                <span className="project-card__time">
                  {formatRelativeTime(project.lastActivity)}
                </span>
              </>
            )}
          </span>
        </div>
      </Link>
    </li>
  );
}
