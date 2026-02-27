/**
 * DataEntryForm Component
 *
 * A simple form for entering data to be inserted into a Dataverse table.
 *
 * DEFAULT TARGET: "contact" table (firstname, lastname, emailaddress1, telephone1, jobtitle)
 * You can adapt the fields below to match any Dataverse table in your environment.
 *
 * PATTERN: Pure presentational component — no service calls.
 * All submission logic is delegated to the parent via the onSubmit callback,
 * which routes to the generated service through the useDataverseForm hook.
 */

import { useState } from "react";

/** Shape of the form data — matches fields on the Dataverse contact table */
export interface FormData {
  firstname: string;
  lastname: string;
  emailaddress1: string;
  telephone1: string;
  jobtitle: string;
}

interface DataEntryFormProps {
  onSubmit: (data: FormData) => Promise<boolean>;
  loading: boolean;
}

const EMPTY_FORM: FormData = {
  firstname: "",
  lastname: "",
  emailaddress1: "",
  telephone1: "",
  jobtitle: "",
};

export function DataEntryForm({ onSubmit, loading }: DataEntryFormProps) {
  const [formData, setFormData] = useState<FormData>({ ...EMPTY_FORM });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ ...EMPTY_FORM }); // reset on success
    }
  };

  return (
    <section className="card">
      <h2>New Contact Record</h2>
      <form onSubmit={handleSubmit}>
        {/* First Name — required */}
        <div className="form-group">
          <label htmlFor="firstname">
            First Name <span className="required-marker">*</span>
          </label>
          <input
            id="firstname"
            type="text"
            value={formData.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
            required
            placeholder="e.g. John"
          />
        </div>

        {/* Last Name — required */}
        <div className="form-group">
          <label htmlFor="lastname">
            Last Name <span className="required-marker">*</span>
          </label>
          <input
            id="lastname"
            type="text"
            value={formData.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
            required
            placeholder="e.g. Doe"
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="emailaddress1">Email</label>
          <input
            id="emailaddress1"
            type="email"
            value={formData.emailaddress1}
            onChange={(e) => handleChange("emailaddress1", e.target.value)}
            placeholder="john.doe@contoso.com"
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="telephone1">Phone</label>
          <input
            id="telephone1"
            type="tel"
            value={formData.telephone1}
            onChange={(e) => handleChange("telephone1", e.target.value)}
            placeholder="+1 555-123-4567"
          />
        </div>

        {/* Job Title */}
        <div className="form-group">
          <label htmlFor="jobtitle">Job Title</label>
          <input
            id="jobtitle"
            type="text"
            value={formData.jobtitle}
            onChange={(e) => handleChange("jobtitle", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving…" : "Insert Record"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFormData({ ...EMPTY_FORM })}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
    </section>
  );
}
