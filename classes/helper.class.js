const DB = require('better-sqlite3-helper');
const User = require('./user.class');

class Helper {
  static updateActiveGame(username, activeGame) {
    DB().update('users', { activeGame }, { username });
  }

  static updateActiveGames(activeGame, ...usernames) {
    usernames.forEach((username) => {
      this.updateActiveGame(username, activeGame);
    });
  }

  static verifyUser(user) {
    return User.fromJSON(user) ? User.fromJSON(user) : undefined;
  }

  static getUserByQuery(query, params) {
    this.verifyUser(DB().query(query, params)[0]);
  }

  static getUser(field, param) {
    const user = DB().query(`SELECT * FROM users WHERE ${field}=?`, param);
    return this.verifyUser(user[0]);
  }

  static insertUser(username, email) {
    return DB().insert('users', [{ username, email }]);
  }

  static insertAndRetrieveUser(username, email) {
    const insertResult = this.insertUser(username, email);

    if (insertResult > 0) {
      this.getUser('id', insertResult);
    }

    return undefined;
  }

  static clearActiveGames() {
    DB()
      .queryColumn('id', 'SELECT id FROM users')
      .forEach((id) => {
        DB().update(
          'users',
          { activeGame: null },
          ['id = ?', id],
          ['activeGame']
        );
      });
  }
}

module.exports = Helper;
