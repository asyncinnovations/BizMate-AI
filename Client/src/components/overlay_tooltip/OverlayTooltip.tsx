"use client";

import React, { forwardRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./OverlayTooltip.css";

// Wrapping in forwardRef ensures Bootstrap can properly attach positioning refs
const TooltipTrigger = forwardRef(({ children, ...props }: any, ref) => (
  <span
    {...props}
    ref={ref}
    style={{ display: "inline-block", cursor: "pointer" }}
  >
    {children}
  </span>
));

TooltipTrigger.displayName = "TooltipTrigger";

const OverlayTooltip = ({
  id,
  children,
  title,
}: {
  id: string;
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <OverlayTrigger
      placement="top"
      popperConfig={{
        modifiers: [
          {
            name: "flip",
            options: { fallbackPlacements: ["bottom", "right"] },
          },
          { name: "preventOverflow", options: { padding: 8 } },
        ],
      }}
      overlay={
        <Tooltip id={id} className="custom-tooltip-wrapper">
          {title}
        </Tooltip>
      }
    >
      <TooltipTrigger>{children}</TooltipTrigger>
    </OverlayTrigger>
  );
};

export default OverlayTooltip;