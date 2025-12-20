import { sp } from "@pnp/sp/presets/all";
import { addListDefaultRecords, CreateFields } from "../../utils/db";

export const createDepartmentList = async () => {
    let listInfo, listFields;
    const listTitle = "Department";
    const exists = await sp.web.lists.getByTitle(listTitle).select("Title")().catch(() => null);
    const fields = [
        { title: "Title", type: "Text" },
    ];

    if (!exists) {
        listInfo = (await sp.web.lists.add(listTitle, "", 100)).list;
    } else {
        listInfo = await sp.web.lists.getByTitle(listTitle);
        const results = await sp.web.lists.getByTitle(listTitle).fields.get();
        listFields = results.map(Field => Field.Title)
    }

    await CreateFields({ listFields, listInfo, fields });

    if (!exists) {
        const departmentsData = [
            { Title: "الإدارة المالية" },
            { Title: "الموارد البشرية" },
            { Title: "تقنية المعلومات" },
            { Title: "السكرتارية الخاصة" },
            { Title: "العلاقات الحكومية (GR)" },
            { Title: "إدارة المشاريع" },
            { Title: "منسق إدارة المشاريع" },
        ];

        await addListDefaultRecords(listTitle, departmentsData);
    }

    return await listInfo.get();
}