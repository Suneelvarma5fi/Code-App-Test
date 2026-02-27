/**
 * useDataverseForm Hook
 *
 * Bridges the UI form to Dataverse via the PAC CLI generated service.
 *
 * ─────────────────────────────────────────────────────────────────────
 * HOW THE DATA BRIDGE WORKS
 * ─────────────────────────────────────────────────────────────────────
 *
 * 1. You run:  pac code add-data-source -a dataverse -t contact
 *    This generates:
 *      • src/generated/models/ContactsModel.ts   — TypeScript types
 *      • src/generated/services/ContactsService.ts — CRUD methods
 *
 * 2. The generated ContactsService uses:
 *      import { getClient } from "@microsoft/power-apps/data";
 *    which is the SDK's data client.  At runtime (inside the Power
 *    Apps host), this client automatically:
 *      - Authenticates via the logged-in user's Entra ID token
 *      - Routes requests through Power Platform's connector layer
 *      - Enforces DLP policies, consent, and sharing limits
 *
 * 3. This hook simply calls:
 *      ContactsService.create(record)   → INSERT
 *      ContactsService.getAll(options)  → SELECT
 *      ContactsService.delete(id)       → DELETE
 *
 * ─────────────────────────────────────────────────────────────────────
 * PREREQUISITE — run once before build:
 *
 *     pac code init --displayname "Dataverse Form App"
 *     pac code add-data-source -a dataverse -t contact
 *
 *   That generates the service files this hook imports.
 *   Without those files, the build will fail.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import type { FormData } from "../components/DataEntryForm";
import { ContactsService } from "../generated/services/ContactsService";
import type { Contacts } from "../generated/models/ContactsModel";

/** Minimal record shape for the list view */
interface DataverseRecord {
  id: string;
  firstname?: string;
  lastname?: string;
  emailaddress1?: string;
  jobtitle?: string;
}

export function useDataverseForm() {
  const [records, setRecords] = useState<DataverseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /** Clear status messages after a short delay */
  const flashSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // ───────────────────────────────────────────────────────────
  // READ — Load existing records on mount
  // ───────────────────────────────────────────────────────────
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ContactsService.getAll({
        select: ["contactid", "firstname", "lastname", "emailaddress1", "jobtitle"],
        orderBy: ["createdon desc"],
        top: 50,
      });

      if (result.success && result.data) {
        setRecords(
          result.data.map((c: Contacts) => ({
            id: c.contactid!,
            firstname: c.firstname,
            lastname: c.lastname,
            emailaddress1: c.emailaddress1,
            jobtitle: c.jobtitle,
          }))
        );
      } else if (!result.success) {
        setError(`Failed to load records: ${result.error?.message ?? "Unknown error"}`);
      }
    } catch (err) {
      setError(`Failed to load records: ${(err as Error).message}`);
      console.error("Error loading records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // ───────────────────────────────────────────────────────────
  // CREATE — Insert a new record into Dataverse
  // ───────────────────────────────────────────────────────────
  const submitRecord = async (formData: FormData): Promise<boolean> => {
    try {
      setError(null);

      if (!formData.firstname || !formData.lastname) {
        setError("First name and last name are required.");
        return false;
      }

      setLoading(true);

      // Build the Dataverse payload
      // Empty strings → undefined so Dataverse treats them as "not set"
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        emailaddress1: formData.emailaddress1 || undefined,
        telephone1: formData.telephone1 || undefined,
        jobtitle: formData.jobtitle || undefined,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await ContactsService.create(payload as any);

      if (result.success) {
        flashSuccess(
          `✓ Record created: ${formData.firstname} ${formData.lastname}`
        );
        await loadRecords(); // refresh the list
        return true;
      } else {
        setError(
          `Failed to create record: ${result.error?.message ?? "Unknown error"}`
        );
        return false;
      }
    } catch (err) {
      setError(`Failed to create record: ${(err as Error).message}`);
      console.error("Error creating record:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // DELETE — Remove a record from Dataverse
  // ───────────────────────────────────────────────────────────
  const deleteRecord = async (id: string): Promise<void> => {
    try {
      if (!confirm("Are you sure you want to delete this record?")) return;

      setError(null);
      setLoading(true);

      await ContactsService.delete(id);
      flashSuccess("✓ Record deleted");
      await loadRecords();
    } catch (err) {
      setError(`Failed to delete record: ${(err as Error).message}`);
      console.error("Error deleting record:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    error,
    successMessage,
    submitRecord,
    deleteRecord,
    refreshRecords: loadRecords,
  };
}
