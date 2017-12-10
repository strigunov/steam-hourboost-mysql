const Steam = require('steam');
const mysql = require('mysql');
const crypto = require('crypto');

let accounts = [];
const delay = 50;

function MakeSha(bytes) {
  var hash = crypto.createHash('sha1');
  hash.update(bytes);
  return hash.digest();
}

const db = mysql.createConnection({
  host: 'DBHOST',
  user: 'DBUSER',
  password: 'DBPASS',
  database: 'DATABASE'
});

db.connect(err => {
  if (err) {
    console.error('[MYSQL] Connection failed:\n%s', err.stack);
    return process.exit();
  }
  console.log('[MYSQL] Connection successful!');
});

db.query('SELECT * FROM hourboost', (err, rows) => {
  if (err) return console.error('[MYSQL] Failed to run query:\n%s', err.stack);

  accounts = [];
  rows.forEach(row => {
    //console.log(row);
    accounts.push([row.username, row.password, row.games, row.steamguard, row.sentry]);
  });
  console.log('[MYSQL] Loaded %s account(s)', accounts.length);

  accounts.forEach((account, i) => {
    const steamClient = new Steam.SteamClient();
    const steamUser = new Steam.SteamUser(steamClient);
    const steamFriends = new Steam.SteamFriends(steamClient);

    setTimeout(() => {
      console.log('[STEAM] Logging into account: %s.', account[0]);
      steamClient.connect();
      sentryFile = account[4] === null ? null : new Buffer(account[4], 'base64');
      steamClient.on('connected', () => {
        steamUser.logOn({
          account_name: account[0],
          password: account[1],
          auth_code: account[3],
          sha_sentryfile: getSHA1(sentryFile)
        });
      });

      const getGameList = games => {
        const str = games.split(',');
        const final = [];
        for (const game of str) final.push({ game_id: parseInt(game) });
        return final;
      };

      steamClient.on('logOnResponse', logonResp => {
        //console.log(logonResp);
        if (logonResp.eresult == Steam.EResult.OK) {
          console.log('[STEAM] Logged successfully into account: %s.', account[0]);
          steamFriends.setPersonaState(Steam.EPersonaState.Online);
          steamUser.gamesPlayed(getGameList(account[2]));
          console.log(
            '[HOURBOOST] Games and online status set for account: %s.',
            account[0],
            JSON.stringify(account[2])
          );
        }
      });

      //Function for generating SHA1 of sentry
      function getSHA1(bytes) {
        var shasum = crypto.createHash('sha1');
        shasum.end(bytes);
        return shasum.read();
      }

      //Generating sentry, and link it to account
      steamUser.on('updateMachineAuth', (sentryHash, callback) => {
        console.log('[STEAM] Received Sentry.');
        if (account[4] !== null) return;
        let sentry = sentryHash.bytes.toString('base64');
        callback({ sha_file: getSHA1(sentryHash.bytes) });
        db.query('UPDATE hourboost SET sentry = ? WHERE username = ?', [sentry, account[0]], (err, rows, fields) => {
          if (err) return console.error('[MYSQL] Failed to update account:\n%s', err.stack);
        });
        console.log('[MYSQL] Linked Sentry to account!');
      });

      steamClient.on('error', err => {
        //console.log(err);
        console.log('[STEAM] ERROR - Login failed for account: %s', account[0]);
        if (Steam.EResult.InvalidPassword) {
          console.log('[STEAM] Reason: invalid password');
        } else if (Steam.EResult.AlreadyLoggedInElsewhere) {
          console.log('[STEAM] Reason: already logged in elsewhere');
        } else if (Steam.EResult.AccountLogonDenied) {
          console.log('[STEAM] Reason: logon denied - steam guard needed');
        }
        console.log('[STEAM] Retrying to login into account: %s in 5 minutes.', account[0]);
        setTimeout(function() {
          console.log('[STEAM] Retrying to login into account: %s', account[0]);
          steamClient.connect();
        }, 5 * 60000);
      });
    }, delay * i);
  });
});
