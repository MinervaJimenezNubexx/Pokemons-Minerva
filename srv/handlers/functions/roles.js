async function getUserPermissions (req){
    let userRole = 'Viewer'; //default

    if (req.user.is('Manager')) {
        userRole = 'Manager';
    } else if (req.user.is('Trainer')) {
        userRole = 'Trainer';
    } else if (req.user.is('Viewer')) {
        userRole = 'Viewer';
    }

    const permissions = await cds.db.run(
        SELECT.one.from('pokemons.db.Roles').where({ rol: userRole })
    );

    const userEmail = req.user.id;

    if (!permissions) {
        return {
            rol: userRole,
            edit: false,
            view: true,
            admin: false,
            capture: false,
            email: userEmail
        };
    }

    return {permissions, email: userEmail};
}

module.exports = {
    getUserPermissions
}