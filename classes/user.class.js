/**
 * Class model for users.
 *
 * @class User
 */
class User {
  /**
   * Creates an instance of User.
   * @param {*} username
   * @param {*} socketId
   * @param {*} email
   * @param {*} wins
   * @param {*} draws
   * @param {*} losses
   * @param {*} score
   * @param {*} id
   * @param {*} activeGame
   * @memberof User
   */
  constructor(
    username,
    socketId,
    email,
    wins,
    draws,
    losses,
    score,
    id,
    activeGame
  ) {
    this.username = username;
    this.socketId = socketId;
    this.email = email;
    this.wins = wins;
    this.draws = draws;
    this.losses = losses;
    this.score = score;
    this.id = id;
    this.activeGame = activeGame;
  }

  /**
   * Return username.
   *
   * @return {string}
   * @memberof User
   */
  getUsername() {
    return this.username;
  }

  /**
   * Return ID generated by the database.
   * @returns {number}
   * @memberof User
   */
  getId() {
    return this.id;
  }

  /**
   * Set new username.
   *
   * @param {string} username
   * @memberof User
   */
  setUsername(username) {
    this.username = username;
  }

  /**
   * Set new socket id.
   *
   * @param {string} socketId
   * @memberof User
   */
  setId(socketId) {
    this.socketId = socketId;
  }

  /**
   * Create a new instance of User from a JSON object.
   *
   * @static
   * @param {JSON} json
   * @return {User}
   * @memberof User
   */
  static fromJSON(json) {
    return Object.assign(new User(), json);
  }
}

module.exports = User;
