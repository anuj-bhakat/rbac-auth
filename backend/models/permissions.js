import roles from "../configs/roles.json" with { type: "json" };

class Permission {
    constructor() {
        this.Permissions = [];
    }

    getPermissionsByRoleName(roleName) {
        const role = roles.roles.find((r) => r.name === roleName);
        return role ? role.permissions : [];
    }
}

export default Permission;