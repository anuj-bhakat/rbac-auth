import Permissions from '../models/permissions.js';

export const checkPermission = (permission) => {
  return (req, res, next) => {
    console.log(req);
    const userRole = req.user ? req.user.role : 'anonymous';
    console.log(userRole);
    const userPermissions = new Permissions().getPermissionsByRoleName(userRole);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  };
};