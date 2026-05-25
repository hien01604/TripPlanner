import { useState } from "react";
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import "../../App.css";

// Import functions
import { getNumericCost } from "../../services/budgetService";

export default function BudgetTable({
  items = [],
  categories,
  onSaveRow,
  onDeleteRow,
}) {
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [draft, setDraft] = useState({
    name: "",
    category: "",
    estimatedCost: "",
    actualCost: "",
    paymentStatus: "",
  });

  const [editRowId, setEditRowId] = useState(null);

  const FILTER_CATEGORIES = [{ _id: "all", name: "All" }, ...categories];

  const filtered = items.filter((item) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  function handleEdit(row) {
    setEditRowId(row.id);

    setDraft({
      name: row.name,
      category: row.category,
      estimatedCost: row.estimatedCost,
      actualCost: row.actualCost,
      paymentStatus: row.paymentStatus,
    });
  }

  function handleSave(id) {
    onSaveRow(id, draft);
    setEditRowId(null);
  }

  function handleDelete(id) {
    onDeleteRow(id);
  }

  return (
    <div>
      <div className="category-tabs-filter">
        <div className="category-tabs">
          {FILTER_CATEGORIES.map((category) => (
            <button
              key={category._id}
              onClick={() => {
                setActiveCategory(category.name);
                setPage(1);
              }}
              className={`tab-item ${
                activeCategory === category.name ? "tab-item--active" : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="budget-empty-state">
          <div className="budget-empty-image" aria-hidden>
            💵
          </div>

          <h2>No expenses tracked yet</h2>
          <p>Start adding estimated or actual trip costs.</p>
        </div>
      ) : (
        <>
          <div className="budget-table-wrap">
            <table className="budget-table">
              <thead>
                <tr>
                  <th className="id-column">ID</th>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Estimated cost</th>
                  <th>Actual cost</th>
                  <th>Payment</th>
                  <th>Difference</th>
                  <th className="utility-column"></th>
                  <th className="utility-column"></th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      editRowId === item.id
                        ? "budget-row budget-row--editing"
                        : "budget-row"
                    }
                  >
                    <td className="id-column">{item.id}</td>

                    <td>
                      {editRowId === item.id ? (
                        <input
                          className="table-edit-input"
                          value={draft.name}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        item.name
                      )}
                    </td>

                    <td
                      className={`category category-${String(
                        item.category
                      ).toLowerCase()}`}
                    >
                      {editRowId === item.id ? (
                        <select
                          className="table-edit-input"
                          value={draft.category}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="">Select category</option>

                          {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.category
                      )}
                    </td>

                    <td>
                      {editRowId === item.id ? (
                        <input
                          className="table-edit-input"
                          type="number"
                          value={draft.estimatedCost}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              estimatedCost: e.target.value,
                            })
                          }
                        />
                      ) : (
                        Number(item.estimatedCost || 0).toLocaleString()
                      )}
                    </td>

                    <td>
                      {editRowId === item.id ? (
                        <input
                          className="table-edit-input"
                          type="number"
                          value={draft.actualCost}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              actualCost: e.target.value,
                            })
                          }
                        />
                      ) : (
                        Number(item.actualCost || 0).toLocaleString()
                      )}
                    </td>

                    <td>
                      {editRowId === item.id ? (
                        <select
                          className="table-edit-input"
                          name="paymentStatus"
                          value={draft.paymentStatus}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              paymentStatus: e.target.value,
                            })
                          }
                        >
                          <option value="">Select status</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      ) : (
                        item.paymentStatus
                      )}
                    </td>

                    <td
                      className={`difference ${
                        item.difference < 0 ? "difference-negative" : ""
                      }`}
                    >
                      {getNumericCost(draft.actualCost) &&
                      getNumericCost(draft.estimatedCost)
                        ? (
                            Number(draft.actualCost) -
                            Number(draft.estimatedCost)
                          ).toLocaleString()
                        : Number(item.difference || 0).toLocaleString()}
                    </td>

                    <td className="utility-column">
                      {editRowId === item.id ? (
                        <div className="row-actions">
                          <button
                            className="primary-btn"
                            onClick={() => handleSave(item.id)}
                          >
                            Save
                          </button>

                          <button
                            className="tertiary-btn"
                            onClick={() => setEditRowId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="secondary-icon-btn"
                          onClick={() => handleEdit(item)}
                          aria-label="Edit item"
                        >
                          <MdOutlineEdit />
                        </button>
                      )}
                    </td>

                    <td className="utility-column">
                      <button
                        className="secondary-icon-btn"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete item"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <select
              className="page-number"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <div className="page-mover">
              {[
                { icon: "«", action: () => setPage(1) },
                {
                  icon: "‹",
                  action: () => setPage((p) => Math.max(1, p - 1)),
                },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {btn.icon}
                </button>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "#555",
                }}
              >
                Page
                <select
                  value={page}
                  onChange={(e) => setPage(Number(e.target.value))}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: "3px 6px",
                    fontSize: 13,
                  }}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                / {totalPages}
              </div>

              {[
                {
                  icon: "›",
                  action: () => setPage((p) => Math.min(totalPages, p + 1)),
                },
                {
                  icon: "»",
                  action: () => setPage(totalPages),
                },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  style={{
                    width: 28,
                    height: 28,
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}