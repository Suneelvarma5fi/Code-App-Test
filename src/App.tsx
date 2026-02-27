/**
 * Dataverse Form App — Main Application Component
 *
 * A simple SPA that demonstrates inserting data into a Dataverse table
 * using Power Apps Code Apps generated services.
 *
 * DATA FLOW:
 *   User fills form → Component → useDataverseForm hook → Generated Service → Dataverse
 *
 * IMPORTANT:
 *   The generated services in src/generated/ are auto-created by the PAC CLI.
 *   Run: pac code add-data-source -a dataverse -t <table-logical-name>
 *   This generates the typed services + models your app uses.
 */

import { DataEntryForm } from "./components/DataEntryForm";
import { RecordList } from "./components/RecordList";
import { useDataverseForm } from "./hooks/useDataverseForm";
import "./App.css";

function App() {
  const {
    records,
    loading,
    error,
    successMessage,
    submitRecord,
    deleteRecord,
    refreshRecords,
  } = useDataverseForm();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dataverse Form</h1>
        <p className="subtitle">
          Insert data into your Dataverse table via Power Apps Code App
        </p>
      </header>

      {/* Status Messages */}
      {error && <div className="message error">{error}</div>}
      {successMessage && <div className="message success">{successMessage}</div>}

      {/* Main Content */}
      <div className="content-grid">
        {/* Left: Data Entry Form */}
        <DataEntryForm onSubmit={submitRecord} loading={loading} />

        {/* Right: Records List */}
        <RecordList
          records={records}
          loading={loading}
          onDelete={deleteRecord}
          onRefresh={refreshRecords}
        />
      </div>

      <footer className="app-footer">
        <p>
          Built with <strong>Power Apps Code Apps</strong> + React + Vite.
          All Dataverse operations use generated services from{" "}
          <code>pac code add-data-source</code>.
        </p>
      </footer>
    </div>
  );
}

export default App;
