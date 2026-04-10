import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RoleManagementLayer from "../components/RoleManagementLayer";

const RoleManagementPage = () => (
  <MasterLayout>
    <Breadcrumb title="Manajemen Role" />
    <RoleManagementLayer />
  </MasterLayout>
);

export default RoleManagementPage;
