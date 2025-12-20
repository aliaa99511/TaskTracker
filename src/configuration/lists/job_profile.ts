import { sp } from "@pnp/sp/presets/all";
import { addListDefaultRecords, CreateFields } from "../../utils/db";

export const createJobProfileList = async () => {
    let listInfo, listFields;
    const listTitle = "JobProfile";
    const exists = await sp.web.lists.getByTitle(listTitle).select("Title")().catch(() => null);
    const fields = [
        { title: "Description", type: "MultilineText" },
        { title: "Active", type: "Boolean" }
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
        const jobProfileData = [
            { Title: "مهندس برمجيات", Active: true },
            { Title: "مدير مشروع", Active: true },
            { Title: "أخصائي موارد بشرية", Active: true },
            { Title: "محاسب", Active: true },
            { Title: "مدير تسويق", Active: true },
            { Title: "مندوب مبيعات", Active: true },
            { Title: "ممثل خدمة العملاء", Active: true },
            { Title: "محلل أعمال", Active: true },
            { Title: "مسؤول الشبكة", Active: true },
            { Title: "مهندس ضمان الجودة", Active: true },
            { Title: "مصمم جرافيك", Active: true },
            { Title: "عالم بيانات", Active: true },
            { Title: "مستشار قانوني", Active: true },
            { Title: "مدير العمليات", Active: true },
            { Title: "محلل مالي", Active: true },
        ];
        await addListDefaultRecords(listTitle, jobProfileData);
    }

    return await listInfo.get();
}