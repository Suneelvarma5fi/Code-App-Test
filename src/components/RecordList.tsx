/**
 * RecordList Component
 *
 * Displays a list of records fetched from Dataverse.
 * Pure presentational — all actions delegated via callbacks.
 */

interface RecordListProps {
  records: Array<{
    id: string;
    firstname?: string;
    lastname?: string;
    emailaddress1?: string;
    jobtitle?: string;
  }>;
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export function RecordList({
  records,
  loading,
  onDelete,
  onRefresh,
}: RecordListProps) {
  return (
    <section className="card">
      <div className="records-header">
        <h2>Records ({records.length})</h2>
        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {records.length === 0 ? (
        <div className="empty-state">
          <p>No records yet. Use the form to insert your first record.</p>
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="record-item">
            <div className="record-info">
              <h3>
                {record.firstname} {record.lastname}
              </h3>
              {record.emailaddress1 && <p>{record.emailaddress1}</p>}
              {record.jobtitle && <p>{record.jobtitle}</p>}
            </div>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(record.id)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </section>
  );
}
