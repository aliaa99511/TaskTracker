

export const getNavItemsByRole = (role: string[]) => {
    const base = [
        {
            label: "مهامي",
            to: "/",
            children: [
                { label: "المهام قيد الانتظار", to: "/myPendingTasksLog" },
                { label: "جميع المهام", to: "/myTasks" },
            ]
        },
    ];

    if (role.includes("manager")) {
        base.push({
            label: "مهام الفريق",
            to: "/",
            children: [
                { label: "لوحة التحكم", to: "Dashboard" },
                { label: "مهام الفريق", to: "teamTasksLog" },
            ]
        });
    }

    return base;
};