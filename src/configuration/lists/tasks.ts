import { sp } from "@pnp/sp/presets/all";
import { CreateFields } from "../../utils/db";
import { GetPriorityOptions } from "../options_field/tasks_priority";
import { GetStatusOptions } from "../options_field/tasks_status";

type TasksReferenceIds = {
    EmployeeId: string;
    DepartmentId: string;
    TaskTypeId: string;
};

export const createTasksList = async (listsId: TasksReferenceIds) => {
    let listInfo, listFields;
    const listTitle = "Tasks";

    const exists = await sp.web.lists.getByTitle(listTitle).select("Title")().catch(() => null);

    const fields = [
        { title: "Employee", type: "LookUp", listId: listsId.EmployeeId },
        { title: "Department", type: "LookUp", listId: listsId.DepartmentId },
        { title: "TaskType", type: "LookUp", listId: listsId.TaskTypeId },
        { title: "ManagerID", type: "Person or Group" },
        { title: "StartDate", type: "Date" },
        { title: "DueDate", type: "Date" },
        { title: "ConcernedEntity", type: "Text" },
        { title: "Description", type: "MultilineText" },
        {
            title: "Notes",
            type: "MultilineText",
            richText: true,
            appendOnly: true,
            numLines: 6,
            richTextMode: "FullHtml"  // or "Compatible" for limited HTML
        },
        { title: "Priority", type: "Choice", options: GetPriorityOptions() },
        { title: "Status", type: "Choice", options: GetStatusOptions() },
    ];

    if (!exists) {
        listInfo = (await sp.web.lists.add(listTitle, "", 100)).list;
    } else {
        listInfo = await sp.web.lists.getByTitle(listTitle);
        const results = await sp.web.lists.getByTitle(listTitle).fields.get();
        listFields = results.map(field => field.Title)
    }

    await CreateFields({ listFields, listInfo, fields });

    return await listInfo.get();
}