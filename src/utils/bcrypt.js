const bcrypt = require('bcrypt');

const createHash = plainPassword => {
    return bcrypt.hashSync(plainPassword, 10);
};

const compareHash = (plainPassword, hash) => {
    return bcrypt.compareSync(plainPassword, hash);
};

module.exports = {
    createHash,
    compareHash,
};
