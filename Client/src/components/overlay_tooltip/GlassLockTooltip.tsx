"use client";

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./glass-lock.css";

interface Props {
  id: string;
  title: string;
  children: React.ReactElement;
  enabled?: boolean;
}

const GlassLockTooltip = ({ id, title, children, enabled = true }: Props) => {
  // If enabled, just return the children without extra wrappers to keep the DOM clean
  if (enabled) return <>{children}</>;

  const tooltip = (
    <Tooltip id={id} className="glass-tooltip">
      <div className="tooltip-inner-text">{title}</div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 100 }}
      overlay={tooltip}
    >
      <div className="glass-lock-container">
        <div className="glass-content-blur">{children}</div>
        <div className="glass-overlay">
          <span className="glass-badge">PRO</span>
        </div>
      </div>
    </OverlayTrigger>
  );
};

export default GlassLockTooltip;
