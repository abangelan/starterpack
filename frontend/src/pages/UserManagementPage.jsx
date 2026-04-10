import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UserManagementLayer from "../components/UserManagementLayer";

const UserManagementPage = () => (
  <MasterLayout>
    <Breadcrumb title="Manajemen Pengguna" />
    <UserManagementLayer />
  </MasterLayout>
);

export default UserManagementPage;
