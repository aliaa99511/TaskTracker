import { sp } from "@pnp/sp/presets/all";
import { CreateFields } from "../../utils/db";

export const createTaskTypeList = async ({ DepartmentId }: { DepartmentId: string; }) => {
    let listInfo, listFields;
    const listTitle = "TaskType";
    const exists = await sp.web.lists.getByTitle(listTitle).select("Title")().catch(() => null);
    const fields = [
        { title: "Department", type: "LookUp", DepartmentId },
    ];

    if (!exists) {
        listInfo = (await sp.web.lists.add(listTitle, "", 100)).list;
    } else {
        listInfo = await sp.web.lists.getByTitle(listTitle);
        const results = await sp.web.lists.getByTitle(listTitle).fields.get();
        listFields = results.map(Field => Field.Title)
    }

    await CreateFields({ listFields, listInfo, fields });

    return await listInfo.get();
}