/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Hand-written to match the output of: pac code add-data-source -a dataverse -t contact
 *
 * CRUD service for the Dataverse "contact" table.
 * Uses @microsoft/power-apps/data getClient which handles auth,
 * connector routing, and DLP enforcement at runtime.
 */

import type { ContactsBase, Contacts } from "../models/ContactsModel";
import type { IOperationResult, IOperationOptions } from "@microsoft/power-apps/data";
import { dataSourcesInfo } from "../../../.power/schemas/appschemas/dataSourcesInfo";
import { getClient } from "@microsoft/power-apps/data";

export class ContactsService {
  private static readonly dataSourceName = "contacts";

  private static readonly client = getClient(dataSourcesInfo);

  /**
   * CREATE — Insert a new contact record into Dataverse.
   */
  public static async create(
    record: Partial<ContactsBase>
  ): Promise<IOperationResult<Contacts>> {
    const result = await ContactsService.client.createRecordAsync<
      Partial<ContactsBase>,
      Contacts
    >(ContactsService.dataSourceName, record);
    return result;
  }

  /**
   * UPDATE — Modify an existing contact record.
   */
  public static async update(
    id: string,
    changedFields: Partial<ContactsBase>
  ): Promise<IOperationResult<Contacts>> {
    const result = await ContactsService.client.updateRecordAsync<
      Partial<ContactsBase>,
      Contacts
    >(ContactsService.dataSourceName, id, changedFields);
    return result;
  }

  /**
   * DELETE — Remove a contact record from Dataverse.
   */
  public static async delete(id: string): Promise<IOperationResult<void>> {
    const result = await ContactsService.client.deleteRecordAsync(
      ContactsService.dataSourceName,
      id
    );
    return result;
  }

  /**
   * GET — Retrieve a single contact by ID.
   */
  public static async get(
    id: string,
    options?: IOperationOptions
  ): Promise<IOperationResult<Contacts>> {
    const result = await ContactsService.client.retrieveRecordAsync<Contacts>(
      ContactsService.dataSourceName,
      id,
      options
    );
    return result;
  }

  /**
   * GET ALL — Retrieve multiple contacts with optional filtering/sorting.
   */
  public static async getAll(
    options?: IOperationOptions
  ): Promise<IOperationResult<Contacts[]>> {
    const result =
      await ContactsService.client.retrieveMultipleRecordsAsync<Contacts>(
        ContactsService.dataSourceName,
        options
      );
    return result;
  }
}
