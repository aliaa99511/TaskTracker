import { sp } from "@pnp/sp/presets/all";
import { CreateFields } from "../../utils/db";
import { GetEmployeeTypeOptions } from "../options_field/employee_type";

type EmployeeReferenceIds = {
    DepartmentId: string;
    JobProfileId: string;
};

export const createEmployeeList = async (listsId: EmployeeReferenceIds) => {
    let listInfo, listFields;
    const listTitle = "Employee";
    const exists = await sp.web.lists.getByTitle(listTitle).select("Title")().catch(() => null);
    const fields = [
        { title: "Employee", type: "User" },
        { title: "EmployeeID", type: "Text" },
        { title: "EmployeeType", type: "Choice", options: GetEmployeeTypeOptions() },
        { title: "EmployeeName", type: "Text" },
        { title: "HiringDate", type: "Date" },
        { title: "BusinessMobileNumber", type: "Text" },
        { title: "JobProfile", type: "LookUp", listId: listsId.JobProfileId },
        { title: "Department", type: "LookUp", listId: listsId.DepartmentId },
        { title: "DirectManager", type: "User" },
        { title: "WorkEmail", type: "Text" },
        { title: "ExtensionNumber", type: "Text" },
        { title: "Active", type: "Boolean" },
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





