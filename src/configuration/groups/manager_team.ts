import { sp } from "@pnp/sp/presets/all";

export async function createSharePointManagerGroup() {
    try {
        const groupName = "Manager Team Members";

        await sp.web.siteGroups.add({
            Title: groupName,
            Description: "This group manages Manager-related documents.",
            AllowMembersEditMembership: false,
            OnlyAllowMembersViewMembership: true
        });

    } catch (error) {
        console.error("Error creating group:", error);
    }
}
