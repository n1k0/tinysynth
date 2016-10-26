import React from "react";

declare module "react-mdl/extra/material.js" {
  declare var exports: {};
}

declare module "react-mdl" {
  declare var exports: {
    Button: React.Element,
    Dialog: React.Element,
    DialogActions: React.Element,
    DialogContent: React.Element,
    DialogTitle: React.Element,
    FABButton: React.Element,
    Icon: React.Element,
    Slider: React.Element,
    Switch: React.Element,
  };
}
