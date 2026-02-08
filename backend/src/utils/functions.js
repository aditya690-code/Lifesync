function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function verifyPassword(password, salt, hash) {
  const passwordHash = hashPassword(password, salt);
  return passwordHash === hash;
}

function generateEmailVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function verifyEmailVerificationToken(token, user) {
  return (
    user.emailVerificationToken === token &&
    user.emailVerificationTokenExpires > Date.now()
  );
}

module.exports = {
  hashPassword,
  generateSalt,
  verifyPassword,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
};
