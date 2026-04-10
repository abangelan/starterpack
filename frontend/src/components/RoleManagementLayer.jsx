import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import {
  getRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
  exportRolesExcelApi,
  exportRolesPdfApi,
} from "../api/roles";

const EMPTY_FORM = { name: "", description: "", is_active: true };

const RoleManagementLayer = () => {
  const [roles, setRoles]     = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [perPage, setPerPage]         = useState(10);
  const [page, setPage]               = useState(1);

  const [showModal, setShowModal]   = useState(false);
  const [isEdit, setIsEdit]         = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleting, setDeleting]               = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRolesApi({ page, per_page: perPage, search, is_active: filterStatus });
      setRoles(res.data.data);
      setMeta(res.data.meta || res.data);
    } catch {
      toast.error("Gagal mengambil data role");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, filterStatus]);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilterStatus = (e) => { setFilterStatus(e.target.value); setPage(1); };
  const handlePerPage = (e) => { setPerPage(Number(e.target.value)); setPage(1); };

  const openAdd = () => {
    setIsEdit(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  };

  const openEdit = (role) => {
    setIsEdit(true);
    setEditId(role.id);
    setForm({ name: role.name, description: role.description || "", is_active: role.is_active });
    setFormErrors({});
    setShowModal(true);
  };

  const openDelete = (role) => {
    setDeleteTarget(role);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Nama role wajib diisi";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateRoleApi(editId, form);
        toast.success("Role berhasil diupdate");
      } else {
        await createRoleApi(form);
        toast.success("Role berhasil ditambahkan");
      }
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setFormErrors(data.errors);
      else toast.error(data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRoleApi(deleteTarget.id);
      toast.success("Role berhasil dihapus");
      setShowDeleteModal(false);
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus role");
    } finally {
      setDeleting(false);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await exportRolesExcelApi({ search, is_active: filterStatus });
      downloadBlob(res.data, "roles.xlsx");
    } catch { toast.error("Gagal export Excel"); }
    finally { setExporting(false); }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const res = await exportRolesPdfApi({ search, is_active: filterStatus });
      downloadBlob(res.data, "roles.pdf");
    } catch { toast.error("Gagal export PDF"); }
    finally { setExporting(false); }
  };

  const totalPages = meta.last_page || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <Icon icon="solar:shield-user-bold-duotone" className="text-primary-600 text-2xl" />
          <h5 className="mb-0">Manajemen Role</h5>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-success-600 text-sm btn-sm px-12 py-10 radius-8 d-flex align-items-center gap-2"
            onClick={handleExportExcel}
            disabled={exporting}
          >
            <Icon icon="vscode-icons:file-type-excel" className="text-lg" />
            Export Excel
          </button>
          <button
            className="btn btn-danger-600 text-sm btn-sm px-12 py-10 radius-8 d-flex align-items-center gap-2"
            onClick={handleExportPdf}
            disabled={exporting}
          >
            <Icon icon="vscode-icons:file-type-pdf2" className="text-lg" />
            Export PDF
          </button>
          <button
            className="btn btn-primary text-sm btn-sm px-12 py-10 radius-8 d-flex align-items-center gap-2"
            onClick={openAdd}
          >
            <Icon icon="ic:round-plus" className="text-lg" />
            Tambah Role
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-body p-24 pb-0">
        <div className="row gy-3 gx-3 mb-16">
          <div className="col-md-5">
            <div className="icon-field">
              <span className="icon"><Icon icon="iconoir:search" /></span>
              <input
                type="text"
                className="form-control radius-8"
                placeholder="Cari nama role..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select radius-8" value={filterStatus} onChange={handleFilterStatus}>
              <option value="">Semua Status</option>
              <option value="1">Aktif</option>
              <option value="0">Nonaktif</option>
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select radius-8" value={perPage} onChange={handlePerPage}>
              <option value={10}>10 per halaman</option>
              <option value={25}>25 per halaman</option>
              <option value={50}>50 per halaman</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-center">
            <small className="text-secondary-light">
              Total: <strong>{meta.total || 0}</strong> role
            </small>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-body p-24 pt-0">
        <div className="table-responsive">
          <table className="table bordered-table mb-0 sm-table text-sm">
            <thead>
              <tr>
                <th className="text-center" style={{ width: 50 }}>No</th>
                <th>Nama Role</th>
                <th>Deskripsi</th>
                <th className="text-center">Jumlah User</th>
                <th className="text-center">Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-40">
                    <span className="spinner-border spinner-border-sm me-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-40 text-secondary-light">
                    <Icon icon="solar:inbox-unread-broken" className="text-4xl mb-2 d-block mx-auto" />
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                roles.map((role, idx) => (
                  <tr key={role.id}>
                    <td className="text-center">{(page - 1) * perPage + idx + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="w-32-px h-32-px rounded-circle bg-warning-100 d-flex align-items-center justify-content-center">
                          <Icon icon="solar:shield-user-bold-duotone" className="text-warning-600" />
                        </div>
                        <span className="fw-semibold">{role.name}</span>
                      </div>
                    </td>
                    <td className="text-secondary-light">{role.description || "-"}</td>
                    <td className="text-center">
                      <span className="badge bg-primary-100 text-primary-600 fw-semibold px-8 py-4 radius-4">
                        {role.users_count ?? 0}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge text-sm fw-semibold px-8 py-4 radius-4 ${role.is_active ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-600"}`}>
                        {role.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-primary-100 text-primary-600 px-8 py-4 radius-6"
                          onClick={() => openEdit(role)}
                          title="Edit"
                        >
                          <Icon icon="lucide:edit" />
                        </button>
                        <button
                          className="btn btn-sm btn-danger-100 text-danger-600 px-8 py-4 radius-6"
                          onClick={() => openDelete(role)}
                          title="Hapus"
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
            <small className="text-secondary-light">
              Halaman {meta.current_page} dari {totalPages}
            </small>
            <nav>
              <ul className="pagination mb-0 gap-2">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link radius-8 text-sm px-12 py-6" onClick={() => setPage(page - 1)}>
                    <Icon icon="ep:arrow-left" />
                  </button>
                </li>
                {pages.map((p) => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className="page-link radius-8 text-sm px-12 py-6" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className="page-link radius-8 text-sm px-12 py-6" onClick={() => setPage(page + 1)}>
                    <Icon icon="ep:arrow-right" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16">
              <div className="modal-header border-bottom">
                <h5 className="modal-title">
                  <Icon icon={isEdit ? "lucide:edit" : "ic:round-plus"} className="me-2" />
                  {isEdit ? "Edit Role" : "Tambah Role"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-24">
                  <div className="row gy-16">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Nama Role <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control radius-8 ${formErrors.name ? "is-invalid" : ""}`}
                        placeholder="Masukkan nama role"
                        value={form.name}
                        onChange={handleFormChange}
                      />
                      {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Deskripsi
                      </label>
                      <textarea
                        name="description"
                        className="form-control radius-8"
                        rows={3}
                        placeholder="Deskripsi role (opsional)"
                        value={form.description}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check style-check d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          name="is_active"
                          id="is_active"
                          className="form-check-input"
                          checked={form.is_active}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="is_active" className="form-check-label fw-medium">
                          Role Aktif
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-outline-secondary radius-8" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary radius-8" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {isEdit ? "Simpan Perubahan" : "Tambah Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16">
              <div className="modal-body p-32 text-center">
                <div className="w-80-px h-80-px bg-danger-100 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-16">
                  <Icon icon="mingcute:delete-2-line" className="text-danger-600 text-4xl" />
                </div>
                <h5 className="mb-8">Hapus Role?</h5>
                <p className="text-secondary-light mb-24">
                  Apakah Anda yakin ingin menghapus role <strong>{deleteTarget?.name}</strong>?
                  <br />Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <button className="btn btn-outline-secondary radius-8 px-24" onClick={() => setShowDeleteModal(false)}>
                    Batal
                  </button>
                  <button className="btn btn-danger radius-8 px-24" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagementLayer;
