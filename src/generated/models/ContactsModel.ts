/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Hand-written to match the output of: pac code add-data-source -a dataverse -t contact
 *
 * Contains only the fields used by this app's form.
 * The full contact entity has 200+ columns — add more as needed.
 */

/**
 * ContactsBase — fields you can WRITE when creating / updating a contact.
 */
export interface ContactsBase {
  firstname?: string;
  lastname?: string;
  emailaddress1?: string;
  telephone1?: string;
  mobilephone?: string;
  jobtitle?: string;
  description?: string;
  /** OData bind syntax for lookup fields, e.g. parentcustomerid_account */
  "parentcustomerid_account@odata.bind"?: string;
  /** OData bind syntax for managing partner lookup */
  "msa_managingpartnerid@odata.bind"?: string;
}

/**
 * Contacts — fields returned when READING a contact (includes system columns).
 */
export interface Contacts extends ContactsBase {
  contactid: string;
  fullname?: string;
  createdon?: string;
  modifiedon?: string;
  statecode?: number;
  statuscode?: number;
  _createdby_value?: string;
  _modifiedby_value?: string;
  _ownerid_value?: string;
  _transactioncurrencyid_value?: string;
  _parentcustomerid_value?: string;
  _msa_managingpartnerid_value?: string;
}
