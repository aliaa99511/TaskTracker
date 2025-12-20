import { sp } from "@pnp/sp/presets/all";

interface FieldConfig {
    title: string;
    type: string;
    options?: string[];
    listId?: string;
    formula?: string;
    resultType?: string;
    fieldRefs?: string[];
    displayFormat?: "DateOnly" | "DateTime";
    allowMultiple?: boolean;
    description?: string;
    required?: boolean;
    defaultId?: number;
    defaultText?: string;
}

export const getFormDigestValue = async (baseUrl: string, token: string | null): Promise<string> => {
    let headers: any = {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const formDigestResponse = await fetch(`${baseUrl}/_api/contextinfo`, {
        method: "POST",
        headers,
    });

    const formDigestData = await formDigestResponse.json();
    return formDigestData.d.GetContextWebInformation.FormDigestValue;
};

export async function addListDefaultRecords(listTitle: string, itemsData: any[]) {
    const list = sp.web.lists.getByTitle(listTitle);
    for (const item of itemsData) {
        await list.items.add(item);
    }
}

export function SPSetUp({ token, siteURL }: { token: string | null, siteURL: string }): void {
    if (token) {
        sp.setup({
            sp: {
                baseUrl: siteURL,
                fetchClientFactory: () => {
                    return {
                        fetch: async (url: string, options: any) => {
                            options.headers = {
                                ...options.headers,
                                "Accept": "application/json;odata=verbose",
                                "Content-Type": "application/json;odata=verbose"
                            };
                            if (token) {
                                options.headers = {
                                    ...options.headers,
                                    "Authorization": `Bearer ${token}`,
                                };
                            }
                            return fetch(url, options);
                        },
                    };
                },
            },
        });
    }
}

export async function CreateFields({ listFields, listInfo, fields }: { listFields: any, listInfo: any, fields: FieldConfig[] }) {
    for (const field of fields) {
        if (!listFields?.includes(field.title)) {
            switch (field.type) {
                case "Text":
                    await listInfo.fields.createFieldAsXml(`
                         <Field 
                            Name="${field.title}" 
                            DisplayName="${field.title}" 
                            Type="Text" 
                            Description="${field.description || ''}" 
                             Required="${field.required ? "TRUE" : "FALSE"}"  
                            Group="Custom Columns" />
                        `);
                    break;
                case "Number":
                    await listInfo.fields.createFieldAsXml(`
                         <Field 
                         Type="Number" 
                         DisplayName="${field.title}" 
                         StaticName="${field.title}" 
                         Name="${field.title}" 
                          Required="${field.required ? "TRUE" : "FALSE"}"  
                         Description="${field.description || ''}"
                        />
                    `);
                    break;

                case "MultilineText":
                    await listInfo.fields.createFieldAsXml(`
                         <Field 
                         Type="Note" 
                         DisplayName="${field.title}" 
                         StaticName="${field.title}" 
                         Name="${field.title}" 
                         Description="${field.description || ''}" 
                          Required="${field.required ? "TRUE" : "FALSE"}"  
                         NumLines="6" 
                         RichText="FALSE"
                         />
                    `);
                    break;

                case "Boolean":
                    await listInfo.fields.createFieldAsXml(`
                          <Field 
                          Type="Boolean" 
                          DisplayName="${field.title}" 
                          StaticName="${field.title}" 
                          Name="${field.title}" 
                          Description="${field.description || ''}" 
                         Format="Dropdown"
                        />
                    `);
                    break;

                case "User":
                    await listInfo.fields.createFieldAsXml(`
                        <Field 
                        Type="User" 
                        DisplayName="${field.title}" 
                        StaticName="${field.title}" 
                        Name="${field.title}" 
                        Description="${field.description || ''}" 
                         Required="${field.required ? "TRUE" : "FALSE"}"  
                        UserSelectionMode="PeopleOnly"
                        UserSelectionScope="0" />
                    `);
                    break;

                case "Calculated":
                    await listInfo.fields.createFieldAsXml(`
                        <Field 
                        Type="Calculated" 
                        DisplayName="${field.title}" 
                        StaticName="${field.title}" 
                        Name="${field.title}" 
                        ResultType="${field.resultType}"
                        Description="${field.description || ''}">
                        <Formula><![CDATA[${field.formula}]]></Formula>
                        <FieldRefs>
                            ${field.fieldRefs?.map(name => `<FieldRef Name="${name}" />`).join("")}
                        </FieldRefs>
                        </Field>
                     `);
                    break;
                case "Date":
                    {
                        const displayFormat = field.displayFormat === "DateTime" ? "DateTime" : "DateOnly";
                        await listInfo.fields.createFieldAsXml(`
                            <Field 
                            Type="DateTime" 
                            DisplayName="${field.title}" 
                            StaticName="${field.title}" 
                            Name="${field.title}" 
                            Format="${displayFormat}" 
                            FriendlyDisplayFormat="Disabled"
                             Required="${field.required ? "TRUE" : "FALSE"}"  
                            LCID="1033"
                            Description="${field.description || ''}"
                            />
                        `);
                        break;
                    }

                case "Choice":
                    const fieldType = field.allowMultiple ? "MultiChoice" : "Choice";
                    await listInfo.fields.createFieldAsXml(`
                        <Field
                        Name="${field.title}"
                        DisplayName="${field.title}"
                        Type="${fieldType}"
                        Format="Dropdown"
                        FillInChoice="FALSE"
                        Overwrite="TRUE"
                        Required="${field.required ? "TRUE" : "FALSE"}"
                        Description="${field.description || ''}">
                        <Default>${field.defaultText || ""}</Default>
                        <CHOICES>
                            ${field.options?.map((opt) => `<CHOICE>${opt}</CHOICE>`).join("")}
                        </CHOICES>
                        </Field>
                    `);
                    break;


                case "LookUp":
                    const lookupType = field.allowMultiple ? "LookupMulti" : "Lookup";
                    const multAttr = field.allowMultiple ? 'Mult="TRUE"' : '';
                    const defaultValueXml = field.defaultId ? `<Default>${field.defaultId}</Default>` : '';
                    await listInfo.fields.createFieldAsXml(`
                        <Field
                            Name="${field.title}"
                            DisplayName="${field.title}"
                            Type="${lookupType}"
                            List="{${field.listId}}"
                            ShowField="Title"
                             Required="${field.required ? "TRUE" : "FALSE"}"  
                            Overwrite="TRUE"
                            Description="${field.description || ''}"
                            ${multAttr}>
                            ${defaultValueXml}
                        </Field>
                    `);
                    break;
            }
            await listInfo.defaultView.fields.add(field.title);
        }
    }
}


export async function uploadFilesToFolder(files: File[], folderUrl: string): Promise<any> {

    try {
        const uploadPromises = Array.from(files).map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();

            const uploadResult = await sp.web.getFolderByServerRelativeUrl(folderUrl)
                .files.add(file.name, arrayBuffer, true);
            return uploadResult;
        });

        return await Promise.all(uploadPromises);
    } catch (err) {
        return err;
    }
}